import store from '@/Store/store'
//引用工具类
import utils from '../utils';
var Fly = require("flyio/dist/npm/wx") //wx.js为您下载的源码文件
var fly = new Fly(); //创建fly实例

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response, promise) => {
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true,
    //   duration: 2000,
    // });
    // return
    if(store.state.token){
      fly.config.headers = {
        'TOKEN': store.state.token
      }
    }else{
      wx.clearStorageSync();
      store.dispatch('setClearStore')
      
    }
    if (typeof (response.data) == 'string' && response.data != '') {
      response.data = JSON.parse(response.data);
    }
    if (response.data.code == "414" || response.data.code == "412" ) {
      var url = '/pages/loginOut/main'
      //token过期拦截
      // wx.removeStorageSync("token");
      store.dispatch('setClearStore')
      wx.clearStorageSync();
      wx.showToast({
        title:'您尚未登录，请先登录',
        icon:'none',
      });
      wx.redirectTo({
        url: "/pages/index/main"
      });
    }
    wx.hideLoading()
  },
  (err, promise) => {
    // Do something with response error
    //promise.resolve("ssss")
    wx.showToast({
      title:'网络不给力，请稍后再试！',
      icon:'none',
    });
    wx.hideLoading()
  }
)

// Set the base url
fly.config.baseURL = "https://charge.xmnewlife.com/"
fly.config.headers = {
  'content-type': 'application/x-www-form-urlencoded',
}


//跨域请求是否发送第三方cookie
fly.config.withCredentials = true;

export default {
  /**
   *   
   * @param {请求地址} url 
   * @param {请求参数}} param 
   * 
   * 两个不带头部的请求方式
   */
  get(url, param) {
    return new Promise((resolve, reject) => {
      fly.request(url, param, {
        method: 'get'
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  post(url, param) {
    return new Promise((resolve, reject) => {
      fly.request(url, param, {
        method: 'post'
      }).then(res => {
        resolve(res)
      })
    })
  },

  /**
   * 
   * @param {请求地址} url 
   * @param {请求参数} param 
   * 带头部参数的请求方式
   */
  getHeader(url, param) {
    return new Promise((resolve, reject) => {
      fly.request(url, param, {
        method: 'get',
        headers: {
          "TOKEN": store.state.token
        }
      }).then(res => {
        resolve(res)
      })
    })
  },
  postHeader(url, param) {
    return new Promise((resolve, reject) => {
      fly.request(url, param, {
        method: 'post',
        headers: {
          "TOKEN": store.state.token
        }
      }).then(res => {
        resolve(res)
      })
    })
  },
  //这里是请求短信验证码专用接口请求
  getCode(url, param) {
    return new Promise((resolve, reject) => {
      fly.request(url, param, {
        method: 'get',
        headers: {
          "Cookie": "school_sesn_id=" + store.state.cookieId
        }
      }).then(res => {
        resolve(res)
      })
    })
  },
  postCode(url, param) {
    return new Promise((resolve, reject) => {
      fly.request(url, param, {
        method: 'post',
        headers: {
          "Cookie": "school_sesn_id=" + store.state.cookieId
        }
      }).then(res => {
        resolve(res)
      })
    })
  }
};
