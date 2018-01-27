<template>
  <div>
    <div class="flex">
        <form action="#" method="post" @submit.prevent="sendLogin" class="login-form">
          <h1>Login</h1>
          <div class="login-form-inner">
            <p><input type="username" name="username" placeholder="Username" value="lsharpe" v-model="login.username"></p>
            <p><input type="password" name="password" placeholder="Password" value="royalties" v-model="login.password"></p>
            <p><button :disabled="!isLoginValid" class="btn btn-primary">Login</button></p>
          </div>
        </form>
        <form action="#" method="post" @submit.prevent="sendSignup" class="join-form">
          <h2>Become a broadcaster</h2>
          <div class="join-form-inner">
            <p><input type="email" name="email" placeholder="Email" value="larry.l.sharpe@gmail.com" v-model="signup.email"></p>
            <p><input type="username" name="username" placeholder="Username" value="lsharpe" v-model="signup.username"></p>
            <p><input type="password" name="password" placeholder="Password" value="royalties" v-model="signup.password"></p>
            <p><button :disabled="!isSignupValid" class="btn btn-warning">Join For Free!</button></p>
          </div>
        </form>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import VueSocketio from 'vue-socket.io'
  import {api} from '../config'

  export default {
    name: 'login',
    computed: {
      ...mapGetters([
        'isLoggedIn',
        'user'
      ]),
      isLoginValid: function () {
        return this.login.password !== '' && this.login.username !== ''
      },
      isSignupValid: function () {
        return this.signup.password !== '' && this.signup.username !== '' && this.signup.email !== ''
      }
    },
    data () {
      return {
        login: {
          password: '',
          username: ''
        },
        signup: {
          email: '',
          password: '',
          username: ''
        }
      }
    },
    created () {
      let usr = JSON.parse(this.$localStorage.get('user'))
      if (usr) {
        Vue.use(VueSocketio, api.getURL())
        this.commitUser(usr)
      }
    },
    methods: {
      loadSockets () {
        Vue.use(VueSocketio, api.getURL())
      },
      clearLogin () {
        this.login.username = ''
        this.login.password = ''
      },
      clearSignup () {
        this.signup.username = ''
        this.signup.password = ''
        this.signup.email = ''
      },
      commitUser (usr) {
        this.loadSockets()
        this.$store.commit('user/set', usr)
        this.$socket.emit('userMeta', {username: usr.username, slug: usr.slug})
        this.$localStorage.set('user', JSON.stringify(usr))
      },
      sendLogin: function (isTrusted, usr = null, pw = null) {
        if (usr) this.login.username = usr
        if (pw) this.login.password = pw
        let url = api.getURL() + '/signin'
        this.$http.post(url, this.login).then((res) => {
          if (res.data.success) {
            this.commitUser(res.data.user)
            this.clearLogin()
            this.$router.push('/')
          }
        })
      },
      sendSignup: function () {
        let url = api.getURL() + '/signup'
        this.$http.post(url, this.signup).then((res) => {
          if (res.data.success) {
            this.sendLogin(true, this.signup.username, this.signup.password)
            this.clearSignup()
          }
        })
      }
    }
  }
</script>
