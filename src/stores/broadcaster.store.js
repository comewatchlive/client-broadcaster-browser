import Vue from 'vue'

const defaultVals = {
  slug: null,
  tags: [],
  username: null,
  users: [],
  xp: 0,
  coins: 0
}

export const broadcaster = {
  namespaced: true,
  state: {
    slug: defaultVals.slug,
    tags: defaultVals.tags,
    username: defaultVals.username,
    users: defaultVals.users,
    xp: defaultVals.xp,
    coins: defaultVals.coins
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
  }
}
