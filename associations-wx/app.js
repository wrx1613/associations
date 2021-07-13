// app.js
App({
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: this.url + '/wx/login',
          data: {'code': res.code},
          method: 'post',
          success: result =>{
            this.userInfo = result.data;
            if(result.data.user == undefined){
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }else {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }
          },
          fail: res =>{
            
          }
        })
      }
    })
  },
  userInfo: null,
  url: 'http://wrx1613.tk'
})
