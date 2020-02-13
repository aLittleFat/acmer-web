import axios from 'axios'
import qs from 'qs'
import router from './router'

// axios 配置
axios.defaults.timeout = 30000
// axios.defaults.baseURL = 'http://localhost/'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }
    // if (localStorage.token) {
    //   config.headers.Authorization = localStorage.token
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.headers.token) {
      localStorage.token = response.headers.token
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          router.replace('/auth/login')
        }
      }
    }
    return Promise.reject(error.response)
  }
)
export default axios
