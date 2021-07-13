/**
 * 练习系统 API
 */
export default {
  // 部门管理
  office: {
    allList: '/sys/office/allList',
    treeList: '/sys/office/treeList',
    delete: '/sys/office/delete',
    save: '/sys/office/save'
  },
  // 用户管理
  user: {
    list: '/sys/user/list',
    delete: '/sys/user/delete',
    save: '/sys/user/save',
    resetPassword: '/sys/user/resetPassword',
    updateInfo: '/sys/user/updateInfo',
    updatePwd: '/sys/user/updatePwd',
    imageUpload: '/sys/user/imageUpload',
    getAllUser: '/sys/user/getAllUser'
  },
  // 菜单管理
  menu: {
    allList: '/sys/menu/allList',
    treeList: '/sys/menu/treeList',
    allTreeList: '/sys/menu/allTreeList',
    delete: '/sys/menu/delete',
    save: '/sys/menu/save'
  },
  // 权限管理
  role: {
    get: '/sys/role/get',
    list: '/sys/role/list',
    delete: '/sys/role/delete',
    save: '/sys/role/save',
    auth: '/sys/role/auth',
    assignRole: '/sys/role/assignRole'
  },
  // 字典管理
  dict: {
    list: '/sys/dict/list',
    delete: '/sys/dict/delete',
    save: '/sys/dict/save',
  },
  // 日志管理
  log: {
    list: '/sys/log/list',
    delete: '/sys/log/delete',
    empty: '/sys/log/empty'
  }
}
