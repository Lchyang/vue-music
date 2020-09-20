// es6 中 Promise 等API 的转义 写在开始
import 'babel-polyfill'
// 解决移动端点击事件300ms延迟
import fastclick from 'fastclick'
// 从 router.index.js 中导入 router 注册到 根Vue 中
import router from './router'
import Vue from 'vue'
import App from './App'
import store from './store'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
