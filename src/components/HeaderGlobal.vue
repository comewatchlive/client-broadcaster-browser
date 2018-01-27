<template>
  <header>
    <nav class="nav-primary">

      <router-link to="/">
        CWL <sup><small>Broadcaster</small></sup>
      </router-link>

      <div v-if="isLoggedIn">{{user.username}}</div>
      <div v-if="isLoggedIn">
        <a href="#" @click="logout">Logout</a>
      </div>
      <div v-if="!isLoggedIn && !isPage('/login')">
        <router-link to="/login" @click.prevent>Login</router-link>
      </div>

      <div v-if="isPage('/')">

        <show-manager></show-manager>

        <div v-if="!offline">
          <strong>{{viewers}} Viewers</strong>
        </div>

        <div>
          {{broadcaster.xp}} XP
        </div>
      </div>
    </nav>
  </header>
</template>
<style>
  .nav-primary {
    background: rgba(26, 26, 26, 0.8);
    border-bottom: 1px solid #cbcbcb;
    color: #cccccc;
    font-size: 12px;
    left: 0;
    padding: 10px;
    height: 100%;
    width: 140px;
  }
  .nav-primary a{
    color: #fff;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  import ShowManager from '../components/ShowManager/ShowManager.vue'
  import {api} from '../config'

  export default {
    components: {
      ShowManager
    },
    computed: {
      ...mapGetters({
        broadcaster: 'broadcaster',
        isLoggedIn: 'isLoggedIn',
        offline: 'chat/offline',
        user: 'user',
        viewers: 'chat/viewers'

      })
    },
    methods: {
      logout: function () {
        let url = api.getURL() + '/logout/' + this.user.username
        this.$http.get(url).then((res) => {
          if (res.data.success) {
            this.$store.commit('user/reset')
            this.$store.commit('broadcaster/reset')
            this.$localStorage.remove('user')
            this.$router.push('/login')
          }
        })
      },
      isPage (path) {
        return this.$route.path === path
      }
    }
  }
</script>
