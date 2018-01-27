// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router.js'
import VueLocalStorage from 'vue-localstorage'
import {store} from './store'
import VueSocketio from 'vue-socket.io'
import {api} from './config'
import Notifications from 'vue-notification'

Vue.use(Notifications)
Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VueLocalStorage)
Vue.use(VueSocketio, api.getSocketURL(), store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate () {
    let usr = JSON.parse(this.$localStorage.get('user'))
    if (usr) {
      this.$store.commit('user/set', usr)
      this.$socket.emit('userMeta', {username: usr.username, slug: usr.slug})
      this.$localStorage.set('user', JSON.stringify(usr))
    }
  },
  created () {
    window.addEventListener('beforeunload', this.beforeunload)
  },
  methods: {
    beforeunload (e) {
      let user = this.$store.state.user
      let broadcaster = this.$store.state.broadcaster
      this.$socket.emit('broadcasterUnload', { user, broadcaster })
    },
    commitUser (usr) {
      this.$store.commit('user/set', usr)
      this.$socket.emit('userMeta', {username: usr.username, slug: usr.slug})
      this.$localStorage.set('user', JSON.stringify(usr))
    }
  }
})
