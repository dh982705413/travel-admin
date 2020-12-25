import { getInfo, login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    articles: []
  }
}

const types = {
  SET_TOKEN: 'SET_TOKEN',
  SET_AVATAR: 'SET_AVATAR',
  SET_NAME: 'SET_NAME',
  SET_ARTICLE: 'SET_ARTICLE'
}

const state = getDefaultState()

const mutations = {
  [types.SET_NAME](state, name) {
    state.name = name
  },
  [types.SET_AVATAR](state, avatar) {
    state.avatar = avatar
  },
  [types.SET_TOKEN](state, token) {
    state.token = token
  },
  [types.SET_ARTICLE](state, articles) {
    state.articles = articles
  }
}

const actions = {
  login({ commit }, { username, password }) {
    return new Promise(async (resolve, rejected) => {
      try {
        const { token } = await login({ username: username.trim(), password })
        commit(types.SET_TOKEN, token)
        setToken(token)
        resolve('')
      } catch (error) {
        rejected(error)
      }
    })
  },

  getInfo({ commit }) {
    return new Promise(async (resolve, rejected) => {
      try {
        const data = await getInfo()
        const { username, avatar, articles } = data
        commit(types.SET_AVATAR, avatar)
        commit(types.SET_NAME, username)
        commit(types.SET_ARTICLE, articles)
        resolve(data)
      } catch (error) {
        rejected(error)
      }
    })
  },

  logout() {
    removeToken()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
