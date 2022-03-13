import Vue from 'vue'
import Vuex from 'vuex'
// 封装的本地存储操作
import { getItem, setItem } from '@/utils/storage'
// 在本地存储中 token 的key(名字)
const TOKEN = 'TOUTIAO_TOKEN'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户登录信息（TOKEN），为后续获取更方便，且响应式
    tokens: getItem(TOKEN)
  },
  mutations: {
    setToken (state, token) {
      state.tokens = token
      // 防止刷新丢失TOKEN，所以需要重新保存TOKEN到本地存储
      setItem(TOKEN, token)
    }
  },
  actions: {
  },
  modules: {
  }
})
