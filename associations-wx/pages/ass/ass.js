const { showLoading, hideLoading, jsonRequest } = require("../../utils/utils")

// 获取应用实例
const app = getApp()

// pages/ass/ass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.url,
    myAssList: [],
    allAssList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    showLoading();
    jsonRequest(app.url+'/wx/getMyAss', app.userInfo.user).then(res =>{
      this.setData({
        myAssList: res.data
      });
    });
    jsonRequest(app.url+'/wx/getAllAss', {}).then(res =>{
      this.setData({
        allAssList: res.data
      });
    });
    hideLoading();
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
    showLoading();
    jsonRequest(app.url+'/wx/getMyAss', app.userInfo.user).then(res =>{
      this.setData({
        myAssList: res.data
      });
    });
    jsonRequest(app.url+'/wx/getAllAss', {}).then(res =>{
      this.setData({
        allAssList: res.data
      });
    });
    hideLoading();
    console.log("onPullDownRefresh")
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