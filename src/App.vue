<template>
  <div id="app">
    <main id="main">
      <header-global id="header-global"></header-global>

      <router-view/>
    </main>
    <footer-global id="footer-global"></footer-global>
  </div>
</template>

<script>
import Vue from 'vue'
import FooterGlobal from './components/FooterGlobal.vue'
import HeaderGlobal from './components/HeaderGlobal.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

export default {
  name: 'app',
  components: {
    FooterGlobal,
    HeaderGlobal
  }
}
</script>

<style>
  body {
    margin: 0;
    font-family: Arial;
  }
  .btn {
    cursor: pointer;
  }
  .flex {
    display: flex;
  }

  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  #main {
    flex: 1;
    display: flex;
  }

  .blink {
    animation: blink-animation 3s steps(10, start) infinite;
    -webkit-animation: blink-animation 3s steps(10, start) infinite;
  }
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
</style>
