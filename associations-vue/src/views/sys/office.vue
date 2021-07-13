<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4" style="padding-right: 10px">
        <el-input placeholder="名称" v-model="office.name" clearable />
      </el-col>
      <el-col :span="8" style="padding-right: 10px">
        <el-button round icon="el-icon-search" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button icon="el-icon-plus" @click="openAddDialog">增加</el-button>
      </el-col>
    </el-row>
    <el-table
        v-loading="loading"
        :data="list"
        row-key="id"
        :tree-props="{children: 'childs'}"
        style="width: 100%">
      <el-table-column
          prop="name"
          label="名称"/>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          {{ scope.row.master.name }}
        </template>
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"/>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ getDictLabel(scope.row.type, "office_type") }}
        </template>
      </el-table-column>
      <el-table-column
          prop="sort"
          label="排序"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--<el-link icon="el-icon-view" style="margin-right: 15px">查看</el-link>-->
          <el-link icon="el-icon-edit" style="margin-right: 15px" @click="edit(scope.row)">编辑</el-link>
          <el-link icon="el-icon-delete" @click="del(scope.row)" type="danger">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" :visible.sync="form.dialogVisible" v-loading="form.loading">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="父部门">
          <el-select v-model="form.office.parent.id" filterable>
            <el-option label="无" :value="0"/>
            <el-option v-for="item in form.offices" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.office.name"/>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="form.office.master.id" filterable>
            <el-option v-for="item in form.users" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.num }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.office.phone"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.office.type">
            <el-option
                v-for="item in getDictList('office_type')"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.office.sort"/>
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
import icons from '@/static/icons.json'
export default {
  data () {
    return {
      loading: false,
      list: [],
      office: {
        name: ''
      },
      form: {
        dialogVisible: false,
        loading: false,
        offices: '',
        users: '',
        icons: '',
        office: {
          parent: {
            id: '',
            name: ''
          },
          name: '',
          sort: 100,
          type: '',
          master : { id: '' },
          phone: ''
        }
      }
    }
  },
  methods: {
    /** 分页查询用户列表 */
    findList (office) {
      this.loading = true
      this.jsonRequest(this.$api.sys.office.treeList, office).then(result => {
        this.list = result
        this.loading = false
      })
    },
    /* 打开增加窗口 */
    openAddDialog(){
      this.findAllOffices();
      this.findAllUsers();
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.office =
          {
            parent: {
              id: '',
              name: ''
            },
            name: '',
            sort: 100,
            type: '',
            master : { id: '' },
            phone: ''
          }
    },
    /* 提交增加修改的数据 */
    submitForm(){
      this.form.loading = true;
      this.jsonRequest(this.$api.sys.office.save, this.form.office).then(()=> {
        this.form.dialogVisible = false;
        this.message.success({ message: "保存'"+this.form.office.name+"'成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.form.loading = false;
      })
    },
    /* 删除按钮操作 */
    del(office) {
      this.$confirm("确认删除'"+office.name+"'吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formRequest(this.$api.sys.office.delete, {id: office.id}).then(()=>{
          this.message.success({ message: "删除'"+office.name+"'成功", showClose: true })
        }).then(()=>{
          this.findList({});
        });
      })
    },
    /* 编辑按钮操作 */
    edit(office) {
      this.findAllOffices();
      this.findAllUsers();
      this.form.office = JSON.parse(JSON.stringify(office));;
      this.form.dialogVisible = true;
      this.form.loading = false;
    },
    /* 筛选 */
    search(){
      this.findList(this.office)
    },
    /* 获取所有菜单 */
    findAllOffices(){
      this.getRequest(this.$api.sys.office.allList).then((res)=>{
        this.form.offices = res;
      })
    },
    /* 获取所有用户 */
    findAllUsers(){
      this.getRequest(this.$api.sys.user.getAllUser).then((res)=>{
        this.form.users = res;
      })
    }
  },
  mounted () {
    this.findList({})
  }
}
</script>

<style scoped>

</style>
