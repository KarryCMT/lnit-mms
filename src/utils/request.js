import axios from 'axios'
import { Loading,Message } from 'element-ui'
import { type } from 'os'
const loading = {
  loadingInstance:null,
  open:function(){
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
         target: '.main',
         text:'拼命加载中......', 
         background:'rgba(0,0,0,0.3)'
        })
    }
  },
  //关闭加载
  close:function(){
    if(this.loadingInstance !== null){
        this.loadingInstance.close()
      }
      this.loadingInstance = null
  }
}
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000//请求超时，5000毫秒
})
//请求拦截器
request.interceptors.request.use(config => {
  //打开加载窗口
  loading.open()
  return config
  }, error => {
  //出现异常
  //关闭加载窗口
  loading.close()
  return Promise.reject(error);
  })
//响应拦截器
request.interceptors.response.use(response => {
  //关闭加载窗口
  loading.close()
  const resp = response.data
  if (resp.code !== 2000) {
    Message({
      message:resp.message || '系统异常',  
      type:'warning',
      duration:5 * 1000
    })
  }
  return response
}, error => {
  //关闭加载窗口
  loading.close()
  Message({
    message:error.message,
    type:'error',
    duration:5 * 1000 
  })
  return Promise.reject(error);
})
axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

export default request