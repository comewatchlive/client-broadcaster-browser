<template>
  <div id="app">
    <header-global></header-global>
    <main>
      <router-view/>
    </main>
    <footer-global></footer-global>
  </div>
</template>

<script>

import FooterGlobal from './components/FooterGlobal.vue'
import HeaderGlobal from './components/HeaderGlobal.vue'

export default {
  name: 'app',
  components: {
    FooterGlobal,
    HeaderGlobal
  }
}
</script>
