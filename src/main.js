import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueRouter from 'vue-router'
import './plugins/iview.js'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import http from './http.js'
Vue.prototype.$http = http

Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
