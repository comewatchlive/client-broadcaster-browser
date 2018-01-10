<template>
  <div>
    <debugbox></debugbox>
    <div class="flex" v-if="isInShow">
      <div>
        <div class="video-box"></div>
      </div>
      <div>
        <chat-box></chat-box>
      </div>
      <div>
      <div  v-if="currentRoom">
        <p>
          <topic-manager></topic-manager>
        </p>
        <p>
          <strong>Tags:</strong>
          <input-tag :on-change="updateTags" :tags="currentRoom.tags" placeholder="Type Here"/>
        </p>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BroadcasterTagList from '../components/BroadcasterTagList.vue'
  import ChatBox from '../components/ChatBox/ChatBox.vue'
  import ShowManager from '../components/ShowManager/ShowManager.vue'
  import InputTag from 'vue-input-tag'
  import TopicManager from '../components/TopicManager.vue'
  import Debugbox from '../components/Debug'
  import { mapGetters } from 'vuex'
  import {api} from '../config'

  export default {
    components: {
      BroadcasterTagList,
      ChatBox,
      Debugbox,
      InputTag,
      TopicManager,
      ShowManager
    },
    created () {
      this.initPage()
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    beforeRouteUpdate (to, from, next) {
      this.$socket.emit('leaveRoom', {slug: from.slug, show: 'public'})
      this.initPage(to)
      next()
    },
    sockets: {
      showChange (data) {
        if (data.broadcaster === this.broadcaster.slug) {
          this.$store.commit('setBroadcasterStatus', data.show)
        }
      },
      updateViewers (data) {
        this.$store.commit('updateViewers', data)
      }
    },
    computed: {
      ...mapGetters([
        'broadcaster',
        'brodcasterAway',
        'brodcasterOffline',
        'broadcasterPublic',
        'chat',
        'currentRoom',
        'isInShow',
        'user',
        'viewers'
      ]),
      brodcasterPrivate () {
        return this.broadcaster.status === 'private'
      },
      show () {
        return this.broadcaster.status
      }
    },
    methods: {
      initPage () {
        console.log('broadcasterInit')
        this.$socket.emit('broadcasterInit', this.user.slug, (data) => {
          console.log('broadcasterInit Return')
          this.$store.commit('setBroadcaster', data.broadcaster)
          this.$store.commit('removeChatRooms')
        })
      },
      updateBroadcaster (slug = this.$route.params.slug) {
        let url = api.getURL() + '/broadcasters/' + slug
        let req = this.$http.get(url)
        req.then(this.updateBroadcasterSuccess)
        return req
      },
      updateBroadcasterSuccess (res) {
        let broadcaster = res.data.data
        this.$store.commit('setBroadcaster', broadcaster)
        this.updateChatRoom(broadcaster.slug)
      },
      updateChatRoom (slug = this.$route.params.slug, room = this.broadcaster.status) {
        let url = api.getURL() + '/chatrooms/' + slug + '/' + room
        let req = this.$http.get(url)
        req.then(this.updateChatRoomSuccess)
        return req
      },
      updateChatRoomSuccess (res) {
        let room = res.data.data.room
        room.messages = res.data.data.messages
        let user = { slug: this.user.slug, username: this.user.username }
        this.$store.commit('setPublicChatRoom', room)
        this.$socket.emit('joinRoom', room, user)
      },
      updateTags (tags) {
        let obj = {
          _id: this.currentRoom._id,
          tags
        }
        this.$socket.emit('updateTags', obj, (ret) => { return ret })
      }
    }
  }
</script>
<style>
  .video-box {
    background-color: #000;
    height: 400px;
    width: 700px;
  }
</style>
