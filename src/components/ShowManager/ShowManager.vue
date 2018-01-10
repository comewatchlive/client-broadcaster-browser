<template>
  <div class="show-manager">
    <h3 :class="statusClass">{{currentStatus.toUpperCase()}}</h3>
    <div>
      <div class="btn-container" v-if="broadcasterOffline">
        <button class="btn btn-sm btn-success" @click="createShow('public')">Go Online</button></div>
      <div class="btn-container" v-if="broadcasterAway">
        <button class="btn btn-sm btn-success" @click="changeShow('resumeShow')">Go Back Online</button></div>
      <div class="btn-container" v-if="!broadcasterAway && !broadcasterOffline">
        <button class="btn btn-sm btn-warning" @click="changeShow('goAway')">Go Away</button></div>
      <div class="btn-container" v-if="broadcasterPublic || broadcasterAway">
        <button class="btn btn-sm btn-danger" @click="goOffline()">Go Offline</button></div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'currentRoom',
        'currentStatus',
        'broadcasterStatus',
        'broadcasterOffline',
        'broadcasterPublic',
        'broadcasterAway',
        'user'
      ]),
      statusClass () {
        if (this.broadcasterAway) return 'text-warning'
        if (this.broadcasterPublic) return 'text-success blink'
        if (this.broadcasterOffline) return 'text-danger'
      }
    },
    methods: {
      createShow (show) {
        let newShow = {show, slug: this.user.slug, username: this.user.username}
        console.log(newShow)
        this.$socket.emit('createShow', newShow, this.updateRooms)
      },
      changeShow (show) {
        this.$socket.emit(show, this.user.slug, this.updateRooms)
      },
      goOffline () {
        this.$socket.emit('goOffline', this.currentRoom._id, this.setOffline)
      },
      setOffline (rooms) {
        this.$store.commit('removeChatRooms')
      },
      updateRooms (rooms) {
        this.$store.commit('setChatRooms', rooms)
      }
    }
  }
</script>
<style>
  .btn-container{
    margin-bottom:5px;
  }
</style>
