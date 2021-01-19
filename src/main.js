import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueRouter from 'vue-router'
import './plugins/iview.js'
import VeIndex from 'v-charts'
// import VCharts from 'v-charts'
// import VeHistogram from 'v-charts/lib/histogram.common.js'
// import VePie from 'v-charts/lib/pie.common.js'
import http from './http.js'
Vue.prototype.$http = http

Vue.use(VueRouter)
Vue.use(VeIndex)
// Vue.use(VCharts)
// Vue.component(VeHistogram.name, VeHistogram)
// Vue.component(VePie.name, VePie)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
