<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4" style="padding-right: 10px">
        <el-input placeholder="名称" v-model="role.name" clearable />
      </el-col>
      <el-col :span="8" style="padding-right: 10px">
        <el-button round icon="el-icon-search" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button icon="el-icon-plus" @click="openAddDialog">增加</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <span style="color: #8492a6; font-size: 13px">提示：[普通用户]无法进行分配用户、编辑、删除操作，所有用户默认都是[普通用户]角色</span>
    </el-row>
    <el-table
        v-loading="loading"
        :data="list"
        border
        style="width: 100%">
      <el-table-column
          prop="name"
          label="名称"
          width="300px"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link icon="el-icon-coordinate" style="margin-right: 15px" @click="openAuthDialog(scope.row.id)">分配权限</el-link>
          <el-link v-if="scope.row.id != '1'" icon="el-icon-user" style="margin-right: 15px" @click="openAssignroleDialog(scope.row.id)">分配用户</el-link>
          <el-link v-if="scope.row.id != '1'" icon="el-icon-edit" style="margin-right: 15px" @click="edit(scope.row)">编辑</el-link>
          <el-link v-if="scope.row.id != '1'" icon="el-icon-delete" @click="del(scope.row)" type="danger">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 5px">
      <el-pagination
          :page-size="role.page.pageSize"
          :total="role.page.count"
          :current-page="role.page.pageNo"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 30, 50, 100, 500]"
          layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="form.dialogVisible" v-loading="form.loading">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.role.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="auth.dialogVisible" v-loading="auth.loading">
      <el-tree
          :data="auth.menus"
          show-checkbox
          node-key="id"
          :default-checked-keys="auth.checked"
          ref="tree"
          default-expand-all
          check-strictly
          :props="{ id: 'id', children: 'childs', label: 'name'}">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="auth.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuth">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="assignRole.dialogVisible" v-loading="assignRole.loading" width="771px">
      <el-transfer
          filterable
          v-model="assignRole.value"
          :data="assignRole.users"
          :titles="['所有用户', '已分配的用户']"
          :button-texts="['到左边', '到右边']"
          :props="{key: 'id', label: 'name'}">
        <div slot-scope="{ option }">
          <span style="float: left">{{ option.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px;margin-right: 10px">{{ option.num }}</span>
        </div>

      </el-transfer>

      <div slot="footer" class="dialog-footer">
        <el-button @click="assignRole.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssignRole">确 定</el-button>
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
      role: {
        page: {
          pageNo: 1,
          pageSize: 30,
          count: 0,
        },
        name: ''
      },
      form: {
        dialogVisible: false,
        loading: false,
        role: {
          name: ''
        }
      },
      auth: {
        dialogVisible: false,
        loading: false,
        menus: [],
        checked: [],
        role: { id: '' }
      },
      assignRole: {
        users: [],
        dialogVisible: false,
        loading: false,
        value: [],
        role: { id: '' }
      }
    }
  },
  methods: {
    /** 分页查询用户列表 */
    findList (role) {
      this.loading = true
      this.jsonRequest(this.$api.sys.role.list, role).then(result => {
        this.role.page = result;
        this.list = result.list;
        this.loading = false
      })
    },
    /* 打开增加窗口 */
    openAddDialog(){
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.role = {
        name: ''
      }
    },
    /* 提交增加修改的数据 */
    submitForm(){
      this.form.loading = true;
      this.jsonRequest(this.$api.sys.role.save, this.form.role).then(()=> {
        this.form.dialogVisible = false;
        this.message.success({ message: "保存角色'"+this.form.role.name+"'成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.form.loading = false;
      })
    },
    /* 删除按钮操作 */
    del(role) {
      this.$confirm("确认删除角色'"+role.name+"'吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formRequest(this.$api.sys.role.delete, {id: role.id}).then(()=>{
          this.message.success({ message: "删除角色'"+role.name+"'成功", showClose: true })
        }).then(() => {
          this.findList({});
        });
      })
    },
    /* 编辑按钮操作 */
    edit(role) {
      this.form.role = JSON.parse(JSON.stringify(role));
      this.form.dialogVisible = true;
      this.form.loading = false;
    },
    /* 分配权限按钮操作 */
    openAuthDialog(id) {
      this.auth.dialogVisible = true;
      this.auth.loading = true;
      this.findAllTreeList();
      this.formRequest(this.$api.sys.role.get, {id: id}).then((res)=>{
        this.auth.role = res;
        this.auth.checked = [];
        res.menuList.forEach(item => {
          this.auth.checked.push(item.id)
        });
      }).finally(() => {
        this.auth.loading = false;
      });
    },
    /* 提交管理权限 */
    submitAuth() {
      //this.auth.loading = true;
      console.log(this.$refs.tree.getCheckedNodes(false, true));
      let ids1 = this.$refs.tree.getCheckedKeys();
      console.log(ids1);
      let ids2 = this.$refs.tree.getHalfCheckedKeys();
      console.log(ids2);
      let ids = ids1.concat(ids2);
      console.log(ids);
      this.formRequest(this.$api.sys.role.auth, { roleId: this.auth.role.id, menuIds: ids + '' }).then(()=> {
        this.auth.dialogVisible = false;
        this.message.success({ message: "管理'"+this.auth.role.name+"'的权限成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.auth.loading = false;
      })
    },
    /* 分配角色按钮操作 */
    openAssignroleDialog(id) {
      this.assignRole.dialogVisible = true;
      this.assignRole.loading = false;
      this.getAllUser();
      this.formRequest(this.$api.sys.role.get, {id: id}).then((res)=>{
        this.assignRole.role = res;
        this.assignRole.value = [];
        res.userList.forEach(item => {
          this.assignRole.value.push(item.id)
        });
      }).finally(() => {
        this.assignRole.loading = false;
      });
    },
    /* 提交分配用户 */
    submitAssignRole() {
      this.assignRole.loading = true;
      this.formRequest(this.$api.sys.role.assignRole, { roleId: this.assignRole.role.id, userIds: this.assignRole.value + '' }).then(()=> {
        this.assignRole.dialogVisible = false;
        this.message.success({ message: "为'"+this.assignRole.role.name+"'分配用户成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.assignRole.loading = false;
      })
    },
    /* 获取所有菜单（树状） */
    findAllTreeList(){
      this.getRequest(this.$api.sys.menu.allTreeList).then((res)=>{
        this.auth.menus = res;
      })
    },
    /* 获取所有用户 */
    getAllUser(){
      this.getRequest(this.$api.sys.user.getAllUser).then((res)=>{
        this.assignRole.users = res;
      })
    },
    /* 筛选 */
    search(){
      this.findList(this.role)
    },
    handleSizeChange(val) {
      this.role.page.pageSize = val;
      this.findList(this.user);
    },
    handleCurrentChange(val) {
      this.role.page.pageNo = val;
      this.findList(this.user);
    }
  },
  mounted () {
    this.findList({})
  }
}
</script>
