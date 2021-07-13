const { showLoading, hideLoading, jsonRequest } = require("../../utils/utils")

// 获取应用实例
const app = getApp()

// pages/assUser/assUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.url,
    list: [],
    assId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    showLoading();
    jsonRequest(app.url+'/wx/getAssUser', {'id': options.id}).then(res =>{
      this.setData({
        list: res.data,
        assId: options.id
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
    jsonRequest(app.url+'/wx/getAssUser', {'id': this.data.assId}).then(res =>{
      this.setData({
        list: res.data
      });
    });
    hideLoading();
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