import Vue from 'vue'
import Vuex from 'vuex'
import {user} from './stores/user.store'
import {broadcaster} from './stores/broadcaster.store'
import {chat} from './stores/chat.store'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    broadcaster,
    chat,
    user
  },
  getters: {
    broadcaster: state => state.broadcaster,
    isLoggedIn: state => state.user.isLoggedIn,
    user: state => state.user,
    chat: state => state.chat
  }
})
