import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.less'
import '@/styles/icon.less'

import Vant from 'vant'
import 'vant/lib/index.css'

import 'amfe-flexible'

// 时间处理
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
console.log(dayjs().format('YYYY-MM-DD'))
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
