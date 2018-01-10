<template>
      <pre class="debugbox">
<strong>user</strong>
{{user | pretty}}
<strong>broadcaster</strong>
{{broadcaster | pretty}}
<strong>room</strong>
{{currentRoom | pretty}}
<strong>chat</strong>
{{chat | pretty}}
    </pre>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'debug-box',
    computed: {
      ...mapGetters([
        'broadcaster',
        'chat',
        'currentRoom',
        'user'
      ])
    },
    filters: {
      pretty: function (value) {
        return JSON.stringify(value, null, 2)
      }
    }
  }
</script>
<style>
  .debugbox {
    background: #fff;
    border: 3px #ccc solid;
    height: 500px;
    overflow: auto;
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 400px;
    z-index: 9999;
    font-size: 12px;
  }
</style>
