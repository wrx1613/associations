<template>
 <div>
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
     <el-table-column label="审核状态">
       <el-tag size="small" type="" effect="dark">待审核</el-tag>
     </el-table-column>
     <el-table-column label="操作">
       <template slot-scope="scope">
         <el-link icon="el-icon-search" style="margin-right: 15px" @click="detail(scope.row)">查看</el-link>
         <el-link icon="el-icon-check" style="margin-right: 15px" @click="pass(scope.row)" type="success">通过</el-link>
         <el-link icon="el-icon-edit" style="margin-right: 15px" @click="back(scope.row)" type="danger">打回</el-link>
       </template>
     </el-table-column>
   </el-table>
   <el-dialog
       :visible.sync="xiangqing.dialogVisible"
       :close-on-click-modal="false">
     <div class="ql-container ql-snow" style="border: 0px solid #ccc;">
       <div class="ql-editor">
         <div v-html="xiangqing.activity.content"></div>
       </div>
     </div>
     <div slot="footer" clactivity="dialog-footer">
       <el-button type="primary"  @click="xiangqing.dialogVisible = false">确 定</el-button>
     </div>
   </el-dialog>
 </div>
</template>

<script>
export default {
  data () {
    return {
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
      xiangqing: {
        dialogVisible: false,
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
    /** 查询数据 */
    findList() {
      this.loading = true
      this.getRequest(this.$api.ass.activity.checkList).then(result => {
        this.list = result;
      }).finally(()=>{
        this.loading = false
      })
    },

    /* 查看按钮操作 */
    detail(activity) {
      this.xiangqing.activity = activity;
      this.xiangqing.dialogVisible = true;
    },
    /* 提交按钮操作 */
    pass(activity) {
      this.jsonRequest(this.$api.ass.activity.pass, activity).then(()=> {
        this.message.success({ message: "通过活动'"+activity.name+"'成功", showClose: true })
        this.findList();
      })
    },
    /* 打回按钮操作 */
    back(activity) {
      this.jsonRequest(this.$api.ass.activity.back, activity).then(()=> {
        this.message.success({ message: "打回活动'"+activity.name+"'成功", showClose: true })
        this.findList();
      })
    },
  },
  mounted () {
    this.findList();
  }
}
</script>

<style scoped>

</style>
