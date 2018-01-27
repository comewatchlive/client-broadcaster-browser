<template>
  <div>
    <div v-if="isInShow">
      <div v-if="currentRoom" class="flex">
        <div>
          <topic-manager></topic-manager>
        </div>
        <div class="tags-wrapper">
          <input-tag :on-change="updateTags" :tags="currentRoom.tags" placeholder="Type Tags Here" class="form-control"/>
        </div>
      </div>
      <div class="flex">
        <div>
          <div class="video-box"></div>
        </div>
        <div>
          <chat-box></chat-box>
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
  import timer from '../utils/timer'

  export default {
    mixins: [timer],
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
        console.log('update viewers', data, this.chat)
        this.$store.commit('updateViewers', data)
      }
    },
    computed: {
      ...mapGetters({
        away: 'chat/away',
        broadcaster: 'broadcaster',
        chat: 'chat',
        currentRoom: 'chat/currentRoom',
        currentStatus: 'chat/currentStatus',
        isInShow: 'chat/isInShow',
        isLoggedIn: 'isLoggedIn',
        offline: 'chat/offline',
        public: 'chat/public',
        user: 'user',
        viewers: 'chat/viewers'
      }),
      brodcasterPrivate () {
        return this.broadcaster.status === 'private'
      },
      show () {
        return this.broadcaster.status
      }
    },
    methods: {
      initPage () {
        this.$socket.emit('broadcasterInit', this.user.slug, (data) => {
          this.$store.commit('broadcaster/set', data.broadcaster)
          this.$store.commit('chat/removeChatRooms')
          this.timeoutSetup()
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
        this.$store.commit('broadcaster/set', broadcaster)
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
        this.$store.commit('chat/setPublicChatRoom', room)
        this.$socket.emit('joinRoom', room, user)
      },
      updateTags (tags) {
        let obj = {
          _id: this.currentRoom._id,
          tags
        }
        this.$socket.emit('updateTags', obj, (ret) => { return ret })
      },

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
      }
    }
  }
</script>
<style>
  .tags-wrapper {
    width: 400px;
  }
  .video-box {
    background-color: #000;
    height: 400px;
    width: 700px;
  }
</style>
