<template>
  <ul>
    <li v-for="(room,i) in rooms" v-if="hasRooms">
      <a href="#" @click.prevent="selectRoom">{{i}}</a>
    </li>
  </ul>
</template>
<script>
  export default {
    data () {
      return {
        rooms: []
      }
    }
  }
</script>
