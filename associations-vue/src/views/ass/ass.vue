<template>
 <div>
   <el-row style="margin-bottom: 10px">
     <el-col :span="4" style="padding-right: 10px">
       <el-input placeholder="名称" v-model="ass.name" clearable />
     </el-col>
     <el-col :span="12" style="padding-right: 10px">
       <el-button round icon="el-icon-search" @click="search">搜索</el-button>
     </el-col>
     <el-col :span="8" style="text-align: right">
       <el-button icon="el-icon-plus" @click="openAddDialog">增加</el-button>
     </el-col>
   </el-row>
   <el-table
       v-loading="loading"
       :data="list"
       border
       style="width: 100%">
     <el-table-column label="logo">
       <template slot-scope="scope">
         <el-avatar :src="scope.row.photo"></el-avatar>
       </template>
     </el-table-column>
<!--     <el-table-column
         prop="photo"
         label="logo"/>-->
     <el-table-column
         prop="name"
         label="名称"/>
     <el-table-column label="主席">
       <template slot-scope="scope">
         {{ scope.row.master.name }}
       </template>
     </el-table-column>
     <el-table-column label="操作">
       <template slot-scope="scope">
         <el-link icon="el-icon-edit" style="margin-right: 15px" @click="edit(scope.row)">编辑</el-link>
         <el-link icon="el-icon-delete" @click="del(scope.row)" type="danger">删除</el-link>
       </template>
     </el-table-column>
   </el-table>
   <div style="margin: 5px">
     <el-pagination
         :page-size="ass.page.pageSize"
         :total="ass.page.count"
         :current-page="ass.page.pageNo"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :page-sizes="[10, 30, 50, 100, 500]"
         layout="total, sizes, prev, pager, next, jumper"
     >
     </el-pagination>
   </div>
   <el-dialog :close-on-click-modal="false" :visible.sync="form.dialogVisible" v-loading="form.loading" width="380px">
     <el-form label-position="right" label-width="80px">
       <el-form-item label="名称">
         <el-input v-model="form.ass.name" style="width: 217px"/>
       </el-form-item>
       <el-form-item label="负责人">
         <el-select v-model="form.ass.master.id" placeholder="请选择" filterable>
           <el-option
               v-for="item in form.users"
               :key="item.id"
               :label="item.name"
               :value="item.id">
             <span style="float: left">{{ item.name }}</span>
             <span style="float: right; color: #8492a6; font-size: 13px">{{ item.num }}</span>
           </el-option>
         </el-select>
       </el-form-item>
       <!--<el-form-item label="logo">
         <el-input v-model="form.ass.photo"/>
       </el-form-item>-->
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="form.dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="submitForm">确 定</el-button>
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
      ass: {
        page: {
          pageNo: 1,
          pageSize: 30,
          count: 0,
        },
        name: ''
      },
      form: {
        users: '',
        dialogVisible: false,
        loading: false,
        ass: {
          master: {
            id: '',
            name: ''
          },
          name: '',
          photo: ''
        }
      }
    }
  },
  methods: {
    /** 分页查询用户列表 */
    findList (ass) {
      this.loading = true
      this.jsonRequest(this.$api.ass.ass.list, ass).then(result => {
        console.log(result)
        this.ass.page = result;
        this.list = result.list;
        this.loading = false
      })
    },
    /* 打开增加窗口 */
    openAddDialog(){
      this.getAllUser();
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.ass = {
                        master: {
                          id: '',
                          name: ''
                        },
                        name: '',
                        photo: ''
                      }
    },
    /* 提交增加修改的数据 */
    submitForm(){
      this.form.loading = true;
      this.jsonRequest(this.$api.ass.ass.save, this.form.ass).then(()=> {
        this.form.dialogVisible = false;
        this.message.success({ message: "保存社团'"+this.form.ass.name+"'成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.form.loading = false;
      })
    },
    /* 删除按钮操作 */
    del(ass) {
      this.$confirm("确认删除'"+ass.name+"'吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formRequest(this.$api.ass.ass.delete, {id: ass.id}).then(()=>{
          this.message.success({ message: "删除社团'"+ass.name+"'成功", showClose: true })
        }).then(() => {
          this.findList({});
        });
      })
    },
    /* 编辑按钮操作 */
    edit(ass) {
      this.getAllUser();
      this.form.ass = JSON.parse(JSON.stringify(ass));
      this.form.dialogVisible = true;
      this.form.loading = false;
    },
    /* 筛选 */
    search(){
      this.findList(this.ass)
    },
    handleSizeChange(val) {
      this.ass.page.pageSize = val;
      this.findList(this.ass);
    },
    handleCurrentChange(val) {
      this.ass.page.pageNo = val;
      this.findList(this.ass);
    },
    /* 获取所有用户 */
    getAllUser(){
      this.getRequest(this.$api.sys.user.getAllUser).then((res)=>{
        this.form.users = res;
      })
    },
  },
  mounted () {
    this.findList({})
  }
}
</script>

<style scoped>

</style>
