<template>
  <div class="show-manager">
    <h3 :class="statusClass" class="mb-0">{{currentStatus.toUpperCase()}}</h3>
    <h4 :class="timerVisible"><timer></timer></h4>
    <div>
      <div class="btn-container" v-if="offline">
        <button class="btn btn-sm btn-success" @click="createShow('public')">Go Online</button></div>
      <div class="btn-container" v-if="away">
        <button class="btn btn-sm btn-success" @click="changeShow('resumeShow')">Go Back Online</button></div>
      <div class="btn-container" v-if="!away && !offline">
        <button class="btn btn-sm btn-warning" @click="changeShow('goAway')">Go Away</button></div>
      <div class="btn-container" v-if="public || away">
        <button class="btn btn-sm btn-danger" @click="goOffline()">Go Offline</button></div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import timer from '../Timer'
  import {event} from '../../utils/event'

  export default {
    components: {
      timer
    },
    computed: {
      ...mapGetters({
        currentRoom: 'chat/currentRoom',
        currentStatus: 'chat/currentStatus',
        offline: 'chat/offline',
        public: 'chat/public',
        away: 'chat/away',
        user: 'user'
      }),
      statusClass () {
        if (this.away) return 'text-warning'
        if (this.public) return 'text-success blink'
        if (this.offline) return 'text-danger'
      },
      timerVisible () {
        if (this.offline) return 'hidden'
      }
    },
    created () {
      event.init()
    },
    methods: {
      createShow (show) {
        let newShow = {show, slug: this.user.slug, username: this.user.username}
        this.$socket.emit('createShow', newShow, this.updateRooms)
      },
      changeShow (show) {
        this.$socket.emit(show, this.user.slug, this.updateRooms)
      },
      goOffline () {
        this.$socket.emit('goOffline', this.currentRoom._id, this.setOffline)
      },
      setOffline (rooms) {
        this.$store.commit('chat/removeChatRooms')
        event.emit('timer/reset')
      },
      updateRooms (rooms) {
        this.$store.commit('chat/setChatRooms', rooms)

        console.log(this.offline)

        if (this.away) {
          // console.log('this.away')
          event.emit('timer/pause')
        } else if (this.public) {
          // console.log('this.public')
          event.emit('timer/start')
        }
      }
    }
  }
</script>
<style>
  .btn-container{
    margin-bottom:5px;
  }
  .hidden {
    visibility: hidden;
  }
</style>
