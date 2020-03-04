import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueRouter from 'vue-router'
import './plugins/iview.js'
import VCharts from 'v-charts'
import http from './http.js'
Vue.prototype.$http = http

Vue.use(VueRouter)
Vue.use(VCharts)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
