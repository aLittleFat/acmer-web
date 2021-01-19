const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8081,
    https: false,
    hotOnly: false,
    proxy: false,
    before: app => {}
   },
   productionSourceMap: false,
   configureWebpack: config => {
     // if (process.env.NODE_ENV === 'production') {
       return {
         externals: {
           'vue': 'Vue',
           'vue-router': 'VueRouter',
           'vuex': 'Vuex',
           'axios': 'axios',
           'echarts': 'echarts',
           'v-charts': 'VeIndex',
           'iview': 'iview'
         }
       }
     // }
   }
}
