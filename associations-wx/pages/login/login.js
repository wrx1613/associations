const { showLoading, hideLoading, jsonRequest } = require("../../utils/utils")

// 获取应用实例
const app = getApp()

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    username: null,
    password: null,
    textToast: false,
    hideTextToast: false,
    errInfo: null
  },

  uname:function(e){
    this.setData({
      username:e.detail.value
    })
  },
  
  pwd:function(e){
    this.setData({
      password:e.detail.value
    })
  },

  bind(){
    jsonRequest(app.url+'/wx/bind', {'openid': this.data.userInfo.openid, 'username': this.data.username, 'password': this.data.password}).then(res=>{
      if(res.data.user != null){
        app.userInfo.user = res.data.user;
        wx.switchTab({
          url: '/pages/home/home',
        })
      }else{
        this.setData({
          errInfo:res.data.errInfo
        })
        this.openTextToast();
      }
    })

  },

  openTextToast: function() {
    this.setData({
        textToast: true
    });
    setTimeout(() => {
        this.setData({
            hideTextToast: true
        });
        setTimeout(() => {
            this.setData({
                textToast: false,
                hideTextToast: false,
            });
        }, 300);
    }, 3000);
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})