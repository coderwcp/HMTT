import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载。当使用到对应的组件才进行加载
const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const Qa = () => import('@/views/qa')
const Video = () => import('@/views/video')
const My = () => import('@/views/my')

Vue.use(VueRouter)

// 配置路由映射
const routes = [
  {
    path: '/',
    // name: 'layout', // 当父路由有默认子路由，则父路由不需要name属性，此时浏览器会报一个警告
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'qa',
        name: 'qa',
        component: Qa
      },
      {
        path: 'video',
        name: 'video',
        component: Video
      },
      {
        path: 'my',
        name: 'my',
        component: My
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
