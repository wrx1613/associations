const { showLoading, hideLoading, jsonRequest } = require("../../utils/utils")

// 获取应用实例
const app = getApp()

// pages/activityDetail/activityDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: null,
    content: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    showLoading();
    jsonRequest(app.url+'/wx/getActivity', {'id': options.id}).then(res =>{
      let aa = res.data.content
      aa = aa.replace(/\t/g,'\xa0\xa0')
      //aa = aa.replace(/ /g,'\xa0')
      //console.log(aa)
      this.setData({
        activity: res.data,
        content: aa
      });
      console.log(this.data.activity)
    })
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