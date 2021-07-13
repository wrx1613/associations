<template>
 <div>
   <el-row style="margin-bottom: 10px">
     <el-col :span="4" style="padding-right: 10px">
       <el-input placeholder="描述" v-model="dict.description" clearable />
     </el-col>
     <el-col :span="4" style="padding-right: 10px">
       <el-input placeholder="类型" v-model="dict.type" clearable />
     </el-col>
     <el-col :span="8" style="padding-right: 10px">
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
     <el-table-column
         prop="description"
         label="描述"/>
     <el-table-column
         prop="type"
         label="类型"/>
     <el-table-column
         prop="label"
         label="标签名"/>
     <el-table-column
         prop="value"
         label="数据值"/>
     <el-table-column
         prop="sort"
         label="排序"/>
     <el-table-column label="操作">
       <template slot-scope="scope">
         <el-link icon="el-icon-edit" style="margin-right: 15px" @click="edit(scope.row)">编辑</el-link>
         <el-link icon="el-icon-delete" @click="del(scope.row)" type="danger">删除</el-link>
       </template>
     </el-table-column>
   </el-table>
   <div style="margin: 5px">
     <el-pagination
         :page-size="dict.page.pageSize"
         :total="dict.page.count"
         :current-page="dict.page.pageNo"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :page-sizes="[10, 30, 50, 100, 500]"
         layout="total, sizes, prev, pager, next, jumper"
     >
     </el-pagination>
   </div>
   <el-dialog :close-on-click-modal="false" :visible.sync="form.dialogVisible" v-loading="form.loading">
     <el-form label-position="right" label-width="80px">
       <el-form-item label="描述">
         <el-input v-model="form.dict.description"/>
       </el-form-item>
       <el-form-item label="类型">
         <el-input v-model="form.dict.type"/>
       </el-form-item>
       <el-form-item label="标签名">
         <el-input v-model="form.dict.label"/>
       </el-form-item>
       <el-form-item label="数据值">
         <el-input v-model="form.dict.value"/>
       </el-form-item>
       <el-form-item label="排序">
         <el-input-number v-model="form.dict.sort"/>
       </el-form-item>
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
      dict: {
        page: {
          pageNo: 1,
          pageSize: 30,
          count: 0,
        },
        description: '',
        type: ''
      },
      form: {
        dialogVisible: false,
        loading: false,
        dict: {
          description: '',
          type: '',
          label: '',
          value: '',
          sort: 10
        }
      }
    }
  },
  methods: {
    /** 分页查询用户列表 */
    findList (dict) {
      this.loading = true
      this.jsonRequest(this.$api.sys.dict.list, dict).then(result => {
        this.dict.page = result;
        this.list = result.list;
        this.loading = false
      })
    },
    /* 打开增加窗口 */
    openAddDialog(){
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.dict = {
                          description: '',
                          type: '',
                          label: '',
                          value: '',
                          sort: 10
                        }
    },
    /* 提交增加修改的数据 */
    submitForm(){
      this.form.loading = true;
      this.jsonRequest(this.$api.sys.dict.save, this.form.dict).then(()=> {
        this.form.dialogVisible = false;
        this.message.success({ message: "保存字典成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.form.loading = false;
      })
    },
    /* 删除按钮操作 */
    del(dict) {
      this.$confirm("确认删除该字典吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formRequest(this.$api.sys.dict.delete, {id: dict.id}).then(()=>{
          this.message.success({ message: "删除成功", showClose: true })
        }).then(() => {
          this.findList({});
        });
      })
    },
    /* 编辑按钮操作 */
    edit(dict) {
      this.form.dict = JSON.parse(JSON.stringify(dict));
      this.form.dialogVisible = true;
      this.form.loading = false;
    },
    /* 筛选 */
    search(){
      this.findList(this.dict)
    },
    handleSizeChange(val) {
      this.dict.page.pageSize = val;
      this.findList(this.dict);
    },
    handleCurrentChange(val) {
      this.dict.page.pageNo = val;
      this.findList(this.dict);
    }
  },
  mounted () {
    this.findList({})
  },
}
</script>

<style scoped>

</style>
