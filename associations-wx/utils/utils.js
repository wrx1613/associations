var Promise = require('../plugs/es6-promise.js')
 
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信请求同步方法
 * url
 * data 以对象的格式传入
 */
function jsonRequest(url, data) {
  var jsonRequest = wxPromisify(wx.request)
  return jsonRequest({
    url: url,
    method: 'post',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}
 
// loading加载提示
const showLoading = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success (res) {
        //console.log('显示loading')
        resolve(res)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

// 关闭loading
const hideLoading = () => {
  return new Promise((resolve) => {
    wx.hideLoading()
    //console.log('隐藏loading')
    resolve()
  })
}

 
module.exports = {
  jsonRequest,
  showLoading,
  hideLoading
}