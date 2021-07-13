/**
 * 封装请求响应
 * @author rui
 */
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// axios默认配置
// axios.defaults.timeout = 10000; // 超时时间
 axios.defaults.baseURL = '/apis'; // 默认地址

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // 超时
  timeout: 10000
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // 1. 这个位置就请求前最后的配置
    // 2. 也可以在这个位置加入后端需要的用户授权信息
    config.headers.Authorization = getToken()
    // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    if (config.method === 'get') {
      // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    console.log(config)
    return config
  },
  error => {
    // ''(error);
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  resp => {
    /* 未登录从定向 */
   /* if (data.status && data.status === 200 && data.data.code === 401) {
      Message.warning({ message: data.data.msg, offset: 60, showClose: true })
      router.replace('/')
      return
    }

    if (data.status && data.status === 200 && data.data.code   === 500) {
      Message.error({ message: data.data.msg, offset: 60, showClose: true })
      return
    }
    */
    /*if (resp.status != 200){
      this.$router.push({path:'/error', params: { status: resp.status, message: resp.massage }})
      return
    }*/
      console.log(resp)
    let data = resp.data;
    console.log(data)
    if (data.code === '404'){
      router.push("/404")
      return
    }
    if (data.code != 1) {
      Message.error({ message: data.message, offset: 80, showClose: true })
      //Notification.error({ message: data.message, position: 'bottom-right' })
      return 'error';
    }
    if (data.code == 1) {
      //Message.success({ message: data.message, offset: 80, showClose: true })
      //Notification.success({ message: data.message, position: 'bottom-right' })
    }
    return data.data
  },
  err => {
    /*if (err.response.status === 504 || err.response.status === 404) {
      Message.error({ message: '服务器被吃了⊙﹏⊙∥' })
    } else if (err.response.status === 403) {
      Message.error({ message: '权限不足,请联系管理员!' })
    } else if (err.response.status === 401) {
      Message.error({ message: err.response.data.msg })
    } else {
      if (err.response.data.msg) {
        Message.error({ message: err.response.data.msg })
      } else {
        Message.error({ message: '未知错误!' })
      }
    }*/
    router.push({name:'系统错误页面', params: err.response})
     return /*Promise.resolve(err);*/
  }
)

const base = ''

export const getRequest = url => {
  return service({
    method: 'get',
    url: `${base}${url}`
  })
}

export const jsonRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

export const formRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: qs.stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const uploadFileRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const downloadRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${base}${url}`,
    responseType: 'blob',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

export const downloadFile = (res) => {
  const aLink = document.createElement('a')

  // const blob = new Blob([res.data], {type: 'application/octet-stream;charset=utf-8'});
  const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  // //从response的headers中获取filename, 后端response.setHeader('Content-disposition', 'attachment; filename=xxxx.docx') 设置的文件名;
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const contentDisposition = decodeURI(res.headers['content-disposition'])
  const result = patt.exec(contentDisposition)
  let fileName = result[1]
  fileName = fileName.replace(/\'/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
}

export default service
