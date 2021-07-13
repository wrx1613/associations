<template>
  <div v-if="assList.length == 0">无权操作，详情请联系管理员</div>
  <div v-else>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4" style="padding-right: 10px">
        <el-select v-model="activity.ass.id" @change="search">
          <el-option v-for="item in assList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button icon="el-icon-plus" @click="openAddDialog">增加</el-button>
      </el-col>
    </el-row>
    <el-table
        v-loading="loading"
        :data="list"
        border
        style="width: 100%">
      <el-table-column
          prop="name"
          label="名称"/>
      <el-table-column label="举办社团">
        <template slot-scope="scope">
          {{ scope.row.ass.name }}
        </template>
      </el-table-column>
      <el-table-column
          prop="startTime"
          label="发布时间"/>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '1'" size="small" type="info" effect="dark">草稿</el-tag>
          <el-tag v-if="scope.row.status == '2'" size="small" type="" effect="dark">待审核</el-tag>
          <el-tag v-if="scope.row.status == '3'" size="small" type="success" effect="dark">已通过</el-tag>
          <el-tag v-if="scope.row.status == '0'" size="small" type="warning" effect="dark">已打回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link icon="el-icon-search" style="margin-right: 15px" @click="detail(scope.row)">查看</el-link>
          <template v-if="scope.row.status != '2' && scope.row.status != '3'">
            <el-link icon="el-icon-check" style="margin-right: 15px" @click="submit(scope.row)" type="success">提交
            </el-link>
            <el-link icon="el-icon-edit" style="margin-right: 15px" @click="edit(scope.row)">编辑</el-link>
            <el-link icon="el-icon-delete" @click="del(scope.row)" type="danger">删除</el-link>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 5px">
      <el-pagination
          :page-size="activity.page.pageSize"
          :total="activity.page.count"
          :current-page="activity.page.pageNo"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 30, 50, 100, 500]"
          layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-dialog
        :visible.sync="form.dialogVisible"
        v-loading="form.loading"
        :close-on-click-modal="false"
    >
      <el-form label-position="right" label-width="0px">
        <el-form-item>
          <el-input v-model="form.activity.name" placeholder="请输入活动名称"/>
        </el-form-item>
      </el-form>
      <div style="height: 500px">
        <quill-editor
                      class="editor"
                      ref="myTextEditor"
                      v-model="form.activity.content"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                      @change="onEditorChange($event)">
        </quill-editor>
      </div>


      <div slot="footer" clactivity="dialog-footer">
        <el-button @click="form.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保存草稿</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="xiangqing.dialogVisible"
        v-loading="xiangqing.loading"
        :close-on-click-modal="false">
      <div class="ql-container ql-snow" style="border: 0px solid #ccc;">
        <div class="ql-editor">
          <div v-html="xiangqing.activity.content"></div>
        </div>
      </div>
      <div slot="footer" clactivity="dialog-footer">
        <el-button type="primary" @click="xiangqing.dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {

      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"], // 引用  代码块
            [{header: 1}, {header: 2}], // 1、2 级标题
            [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表
            [{script: "sub"}, {script: "super"}], // 上标/下标
            [{indent: "-1"}, {indent: "+1"}], // 缩进
            // [{'direction': 'rtl'}],                         // 文本方向
            [{size: ["small", false, "large", "huge"]}], // 字体大小
            [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
            [{color: []}, {background: []}], // 字体颜色、字体背景颜色
            [{font: []}], // 字体种类
            [{align: []}], // 对齐方式
            ["clean"], // 清除文本格式
            //["link", "image", "video"] // 链接、图片、视频
          ], //工具菜单栏配置
        },
        placeholder: '请在这里输入简介', //提示
        readyOnly: false, //是否只读
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测
      },

      loading: false,
      list: [],
      assList: [],
      activity: {
        page: {
          pageNo: 1,
          pageSize: 30,
          count: 0,
        },
        ass: {id: ''}
      },
      form: {
        dialogVisible: false,
        loading: false,
        activity: {
          ass: {
            id: '',
            name: ''
          },
          name: '',
          content: '',
          status: '',
          endTime: null
        }
      },
      xiangqing: {
        dialogVisible: false,
        loading: false,
        activity: {
          ass: {
            id: '',
            name: ''
          },
          name: '',
          content: '',
          status: '',
          endTime: null
        }
      }
    }
  },
  methods: {
    // 失去焦点
    onEditorBlur(editor) {
    },
    // 获得焦点
    onEditorFocus(editor) {
    },
    // 开始
    onEditorReady(editor) {
    },
    // 值发生变化
    onEditorChange(editor) {
      this.content = editor.html;
      console.log(editor);
    },


    /** 分页查询用户列表 */
    findList(activity) {
      this.loading = true
      this.jsonRequest(this.$api.ass.activity.list, activity).then(result => {
        console.log(result)
        this.activity.page = result;
        this.list = result.list;
        this.loading = false
      })
    },
    /* 打开增加窗口 */
    openAddDialog() {
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.activity = {
        ass: {
          id: '',
          name: ''
        },
        name: '',
        content: '',
        startTime: '',
        status: '',
        endTime: ''
      };
      this.form.activity.ass.id = this.activity.ass.id;
      console.log(this.form.activity);
    },
    /* 提交增加修改的数据 */
    submitForm() {
      this.form.loading = true;
      this.jsonRequest(this.$api.ass.activity.save, this.form.activity).then(() => {
        console.log(this.form.activity);
        this.form.dialogVisible = false;
        this.message.success({message: "保存活动'" + this.form.activity.name + "'成功", showClose: true})
        this.findList(this.activity);
      }).finally(() => {
        this.form.loading = false;
      })
    },
    /* 删除按钮操作 */
    del(activity) {
      this.$confirm("确认删除活动'" + activity.name + "'吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formRequest(this.$api.ass.activity.delete, {id: activity.id}).then(() => {
          this.message.success({message: "删除活动'" + activity.name + "'成功", showClose: true})
        }).then(() => {
          this.findList(this.activity);
        });
      })
    },
    /* 编辑按钮操作 */
    edit(activity) {
      this.form.activity = JSON.parse(JSON.stringify(activity));
      console.log(this.form.activity.content);
      this.form.dialogVisible = true;
      this.form.loading = false;
    },
    /* 查看按钮操作 */
    detail(activity) {
      this.xiangqing.activity = activity;
      this.xiangqing.dialogVisible = true;
      this.xiangqing.loading = false;
    },
    /* 提交按钮操作 */
    submit(activity) {
      this.jsonRequest(this.$api.ass.activity.submit, activity).then(() => {
        this.message.success({message: "提交活动'" + activity.name + "'成功", showClose: true})
        this.findList(this.activity);
      })
    },
    /* 筛选 */
    search() {
      this.findList(this.activity)
    },
    handleSizeChange(val) {
      this.activity.page.pageSize = val;
      this.findList(this.activity);
    },
    handleCurrentChange(val) {
      this.activity.page.pageNo = val;
      this.findList(this.activity);
    },
  },
  mounted() {
    this.getRequest(this.$api.ass.ass.masterList).then((res) => {
      this.assList = res;
      if(this.assList.length == 0){
        return ;
      }
      this.activity.ass.id = res[0].id;
      this.findList(this.activity);
    })
  }
}
</script>

<style scoped>

.editor {
  line-height: normal !important;
  height: 450px;
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
