const { showLoading, hideLoading, jsonRequest } = require("../../utils/utils")

// 获取应用实例
const app = getApp()

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 1,
    count: 0,
    isBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    showLoading();
    jsonRequest(app.url+'/wx/activityList', {'index': this.data.index++}).then(res =>{
      this.setData({
        list: res.data.list,
        count: res.data.count
      });
      if(this.data.list.length == this.data.count){
        this.setData({
          isBottom: true
        });
      }
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
    showLoading();
    jsonRequest(app.url+'/wx/activityList', {'index': this.data.index++}).then(res =>{
      this.setData({
        list: res.data.list,
        count: res.data.count
      });
      if(this.data.list.length == this.data.count){
        this.setData({
          isBottom: true
        });
      }
    })
    hideLoading();
    console.log("onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isBottom){
      return;
    }
    showLoading();
    jsonRequest(app.url+'/wx/activityList', {'index': this.data.index++}).then(res =>{
      let l = this.data.list;
      res.data.list.forEach(element => {
        l.push(element)
      });
      this.setData({
        list: l
      });
      if(this.data.list.length == this.data.count){
        this.setData({
          isBottom: true
        });
      }
    })
    hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})