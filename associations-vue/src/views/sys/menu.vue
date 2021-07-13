<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4" style="padding-right: 10px">
        <el-input placeholder="姓名" v-model="menu.name" clearable />
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
      <el-table-column label="名称">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>&nbsp;&nbsp;{{ scope.row.name }}
        </template>
      </el-table-column>
<!--      <el-table-column
          prop="name"
          label="名称"/>-->
      <el-table-column
          prop="sort"
          label="排序"/>
      <el-table-column label="是否展示">
        <template slot-scope="scope">
          {{ getDictLabel(scope.row.isShow, "yes_no") }}
        </template>
      </el-table-column>
      <el-table-column
          prop="permission"
          label="权限标识"/>
      <el-table-column
          prop="component"
          label="组件"/>
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
        <el-form-item label="父级菜单">
          <el-select v-model="form.menu.parent.id" filterable>
            <el-option label="无" value="0"/>
            <el-option v-for="item in form.menus" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.menu.name"/>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.menu.sort"/>
        </el-form-item>
        <el-form-item label="图标">
          <el-select v-model="form.menu.icon" placeholder="请选择" filterable>
            <el-option
                v-for="item in form.icons"
                :key="item"
                :label="item"
                :value="item">
              <span style="float: left"><i :class="item"></i></span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
          <i :class="form.menu.icon" style="margin-left: 20px"></i>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.menu.component"/>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="form.menu.permission"/>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-select v-model="form.menu.isShow">
            <el-option
                v-for="item in getDictList('yes_no')"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <span style="color: #8492a6; font-size: 13px">提示：修改菜单后需要刷新才可生效</span>
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
      menu: {
        name: ''
      },
      form: {
        dialogVisible: false,
        loading: false,
        menus: '',
        icons: '',
        menu: {
          parent: {
            id: '',
            name: ''
          },
          name: '',
          sort: 100,
          icon: '',
          isShow : '',
          permission: '',
          component: ''
        }
      }
    }
  },
  methods: {
    /** 分页查询用户列表 */
    findList (menu) {
      this.loading = true
      this.jsonRequest(this.$api.sys.menu.treeList, menu).then(result => {
        this.list = result
        this.loading = false
      })
    },
    /* 打开增加窗口 */
    openAddDialog(){
      this.findAllMenus();
      this.findAllIcons();
      this.form.dialogVisible = true;
      this.form.loading = false;
      this.form.menu =
          {
            parent: {
              id: '',
              name: ''
            },
            name: '',
            sort: 100,
            icon: '',
            isShow : '',
            permission: '',
            component: ''
          }
    },
    /* 提交增加修改的数据 */
    submitForm(){
      this.form.loading = true;
      this.jsonRequest(this.$api.sys.menu.save, this.form.menu).then(()=> {
        this.form.dialogVisible = false;
        this.message.success({ message: "保存菜单'"+this.form.menu.name+"'成功", showClose: true })
        this.findList({});
      }).finally(()=> {
        this.form.loading = false;
      })
    },
    /* 删除按钮操作 */
    del(menu) {
      this.$confirm("确认删除'"+menu.name+"'菜单吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formRequest(this.$api.sys.menu.delete, {id: menu.id}).then(()=>{
          this.message.success({ message: "删除菜单'"+menu.name+"'成功", showClose: true })
        }).then(()=>{
          this.findList({});
        });
      })
    },
    /* 编辑按钮操作 */
    edit(menu) {
      this.findAllMenus();
      this.findAllIcons();
      this.form.menu = JSON.parse(JSON.stringify(menu));;
      this.form.dialogVisible = true;
      this.form.loading = false;
    },
    /* 筛选 */
    search(){
      this.findList(this.menu)
    },
    /* 获取所有菜单 */
    findAllMenus(){
      this.getRequest(this.$api.sys.menu.allList).then((res)=>{
        this.form.menus = res;
      })
    },
    /* 获取所有图标 */
    findAllIcons(){
      this.form.icons = icons;
    }
  },
  mounted () {
    this.findList({})
  }
}
</script>

<style scoped>

</style>
