import axios from 'axios'
import store from '@/store'
import router from '@/router'

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://toutiao.itheima.net/',
    timeout: 5000
  })

  // 请求拦截器
  instance.interceptors.request.use(config => {
    const { tokens } = store.state
    if (tokens && tokens.token) {
      config.headers.Authorization = `Bearer ${tokens.token}`
    }
    return config
  }, err => Promise.reject(err))

  // 响应拦截器
  instance.interceptors.response.use(data => {
    return data
  }, async err => {
    console.dir(err)
    // 如果响应状态码是401,则重新获取token
    if (err.response && err.response.status === 401) {
      const tokens = store.state.tokens
      if (!tokens && !tokens.refresh_token) {
        return router.push('/login')
      }

      // 如果有tokens,但是token过期,拿refresh_token来获取最新token
      try {
        const res = await axios({
          url: 'http://toutiao.itheima.net/v1_0/authorizations',
          method: 'put',
          headers: {
            Authorization: `Bearer ${tokens.refresh_token}`
          }
        })
        store.commit('setToken', {
          token: res.data.data.token,
          refresh_token: tokens.refresh_token
        })
        return instance(err.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log('请求刷线 token 失败', err)
        router.push('/login')
      }
    }
    return Promise.reject(err)
  })

  return instance(config)
}
