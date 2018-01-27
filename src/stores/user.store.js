import Vue from 'vue'

const defaultVals = {
  isLoggedIn: false,
  disableOfflineWarning: false,
  coins: 0,
  roles: ['guest'],
  slug: null,
  username: null
}

export const user = {
  namespaced: true,
  state: {
    isLoggedIn: defaultVals.isLoggedIn,
    disableOfflineWarning: defaultVals.disableOfflineWarning,
    coins: defaultVals.coins,
    roles: defaultVals.roles,
    slug: defaultVals.slug,
    username: defaultVals.username
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    disableOfflineWarning: state => state.disableOfflineWarning,
    coins: state => state.coins,
    roles: state => state.roles,
    slug: state => state.slug,
    username: state => state.username
  },
  mutations: {
    reset: (state) => {
      for (let k in defaultVals) {
        Vue.set(state, k, defaultVals[k])
      }
    },
    set: (state, obj) => {
      for (let k in defaultVals) {
        if (obj[k]) Vue.set(state, k, obj[k])
      }
    }
  },
  actions: {
    getAuth ({ commit }) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}
