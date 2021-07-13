<template>
  <div v-if="assList.length == 0">无权操作，详情请联系管理员</div>
  <div v-else>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4" style="padding-right: 10px">
        <el-select v-model="ass.id" @change="search">
          <el-option v-for="item in assList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="10" style="padding-right: 10px">
      </el-col>
      <el-col :span="20" style="text-align: right">
      </el-col>
    </el-row>
    <el-divider style="margin: 10px 0;"></el-divider>
    <el-row>
      <el-col :span="8">
        <el-row>
          <el-image :src="ass.photo" style="width: 300px;height: 300px;margin: 40px auto 20px; display:block"></el-image>
        </el-row>
        <el-row style="margin-top: 20px;text-align: center">
          <el-upload
            class="upload-demo"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
          <el-button size="small" type="primary">点击修改logo</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row style="height: 580px">
          <quill-editor class="editor"
                        ref="myTextEditor"
                        v-model="ass.summary"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-row>
        <el-row>
          <el-button size="small" type="primary" @click="updateSummary()">修改简介</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {updateUserInfo} from "@/utils/system";

export default {
  data () {
    return {
      assList: [],
      ass: {
        id: '',
        name: '',
        photo: '',
        summary: null,
      },

      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
            [{ script: "sub" }, { script: "super" }], // 上标/下标
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            // [{'direction': 'rtl'}],                         // 文本方向
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ font: [] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ["clean"], // 清除文本格式
            ["link", "image", "video"] // 链接、图片、视频
          ], //工具菜单栏配置
        },
        placeholder: '请在这里输入简介', //提示
        readyOnly: false, //是否只读
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测
      }
    }
  },
  methods: {
    // 失去焦点
    onEditorBlur(editor) {},
    // 获得焦点
    onEditorFocus(editor) {},
    // 开始
    onEditorReady(editor) {},
    // 值发生变化
    onEditorChange(editor) {
      this.content = editor.html;
      console.log(editor);
    },

    search(){
      this.formRequest(this.$api.ass.ass.get, {id: this.ass.id}).then(result => {
        this.ass = result;
      })
    },

    updateSummary(){
      this.jsonRequest(this.$api.ass.ass.updateSummary, this.ass).then(()=>{
        this.message.success({ message: "修改简介成功", showClose: true })
      })
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 < 500;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500kb!');
        return false;
      }
      let fd = new FormData();
      fd.append("file", file);
      fd.append("id", this.ass.id);
      this.uploadFileRequest(this.$api.ass.ass.updateLogo, fd).then(res => {
        this.ass = res;
        this.message.success({ message: "修改成功", showClose: true })
      });
      return false;

      //return isJPG && isLt2M;
    },


  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quillEditor;
    }
  },
  mounted () {
    this.getRequest(this.$api.ass.ass.masterList).then((res)=>{
      this.assList = res;
      if(this.assList.length == 0){
        return ;
      }
      this.ass.id = res[0].id;
      this.search();
    })
  }
}
</script>

<style scoped>
.el-divider {
  margin: 10px 0 !important;
}

.editor {
  line-height: normal !important;
  height: 500px !important;
  white-space: pre-wrap;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
</style>
