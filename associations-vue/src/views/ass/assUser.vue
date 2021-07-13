<template>
  <div v-if="assList.length == 0">无权操作，详情请联系管理员</div>
  <div v-else>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4" style="padding-right: 10px">
        <el-select v-model="assUser.ass.id" @change="search">
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
        style="width: 100%">
      <el-table-column label="班级/部门">
        <template slot-scope="scope">
          {{ scope.row.user.office.name }}
        </template>
      </el-table-column>
      <el-table-column label="学号">
        <template slot-scope="scope">
          {{ scope.row.user.num }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.user.photo"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.user.email }}
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          {{ scope.row.user.电话 }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link icon="el-icon-delete" @click="del(scope.row)" type="danger">移除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 5px">
      <el-pagination
          :page-size="assUser.page.pageSize"
          :total="assUser.page.count"
          :current-page="assUser.page.pageNo"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 30, 50, 100, 500]"
          layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="form.dialogVisible" v-loading="form.loading" width="380px">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="用户">
          <el-select v-model="form.assUser.user.id" placeholder="请选择" filterable>
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
      assList: [],
      assUser: {
        page: {
          pageNo: 1,
          pageSize: 30,
          count: 0,
        },
        ass: {
          id: ''
        }
      },
      form: {
        users: '',
        dialogVisible: false,
        loading: false,
        assUser: {
          ass: {
            id: ''
          },
          user: {
            id: ''
          },
        }
      }
    }
  },
  methods: {

    /* 打开增加窗口 */
    openAddDialog(){
      this.getAllUser();
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.assUser.ass = this.assUser.ass;
      this.form.assUser.user.id = '';
    },
    /* 提交增加修改的数据 */
    submitForm(){
      this.form.loading = true;
      this.jsonRequest(this.$api.ass.assUser.save, this.form.assUser).then(()=> {
        this.form.dialogVisible = false;
        this.message.success({ message: "添加成员成功", showClose: true })
        this.findList(this.assUser);
      }).finally(()=> {
        this.form.loading = false;
      })
    },

    /** 分页查询用户列表 */
    findList (ass) {
      this.loading = true
      this.jsonRequest(this.$api.ass.assUser.list, ass).then(result => {
        this.assUser.page = result;
        this.list = result.list;
        this.loading = false
      })
    },
    /* 筛选 */
    search(){
      this.findList(this.assUser)
    },
    handleSizeChange(val) {
      this.assUser.page.pageSize = val;
      this.findList(this.assUser);
    },
    handleCurrentChange(val) {
      this.assUser.page.pageNo = val;
      this.findList(this.assUser);
    },
    del(assUser){
      this.$confirm("确认移除'"+assUser.user.name+"'吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.jsonRequest(this.$api.ass.assUser.delete, assUser).then(()=>{
          this.message.success({ message: "移除'"+assUser.user.name+"'成功", showClose: true })
        }).then(() => {
          this.findList(this.assUser);
        });
      })
    },
    /* 获取所有用户 */
    getAllUser(){
      this.getRequest(this.$api.sys.user.getAllUser).then((res)=>{
        this.form.users = res;
      })
    },
  },
  mounted () {
    this.getRequest(this.$api.ass.ass.masterList).then((res)=>{
      this.assList = res;
      if(this.assList.length == 0){
        return ;
      }
      this.assUser.ass.id = res[0].id;
      this.findList(this.assUser);
    })
  }
}
</script>

<style scoped>

</style>
