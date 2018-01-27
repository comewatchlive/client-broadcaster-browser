<template>
  <div>
    <ul class="message-list" v-if="currentRoom">
      <li v-for="msg in currentRoom.messages" :key="msg._id" :class="{tip: (msg.msgType === 'tip')}">
        <b v-if="msg.from">{{displayName(msg.from.username)}}:</b>
        <span v-if="msg.msgType === 'tip'">
          Tipped {{msg.amount}}
        </span>
        <span v-else>
          {{msg.message}}
        </span>
      </li>
    </ul>
    <form action="#" @submit.prevent="sendMessage">
      <input v-model="message" name="content" class="form-control"/>
      <button class="btn btn-dark">Send</button>
    </form>

    <audio ref="xsTip" :src="assetBase + 'tip-xs.mp3'"></audio>
    <audio ref="smTip" :src="assetBase + 'tip-sm.mp3'"></audio>
    <audio ref="medTip" :src="assetBase + 'tip-med.mp3'"></audio>
    <audio ref="largeTip" :src="assetBase + 'tip-large.mp3'"></audio>
    <audio ref="xlTip" :src="assetBase + 'tip-xl.mp3'"></audio>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        chatRooms: 'chat/chatRooms',
        currentMessages: 'chat/currentMessages',
        currentRoom: 'chat/currentRoom',
        broadcaster: 'broadcaster',
        user: 'user',
        selectedRoom: 'chat/selectedRoom'
      }),
      hasMsg () {
        return this.message.length
      },
      isAllowed () {
        return (!this.user.isLoggedIn && this.guestLimit) || this.user.isLoggedIn
      }
    },
    updated () {
      this.scrollToEnd()
    },
    data () {
      return {
        assetBase: 'http://cwl-asset-bucket.s3-website-us-east-1.amazonaws.com/',
        message: '',
        tipSounds: ['xs', 'sm', 'med', 'large', 'xl']
      }
    },
    sockets: {
      transmitMsg (msg) {
        this.$store.commit('updateMessages', msg)
      },
      transmitTip (msg) {
        let tip = msg.tip
        this.$store.commit('rcvTip', tip)
        this.playTipSound(tip.amount)
      }
    },
    methods: {
      playTipSound (amount) {
        if (amount >= 1000) this.$refs.xlTip.play()
        else if (amount > 499) this.$refs.largeTip.play()
        else if (amount > 99) this.$refs.medTip.play()
        else if (amount > 4) this.$refs.smTip.play()
        else this.$refs.xsTip.play()
      },
      displayName (username) {
        return (username === this.user.username) ? 'You' : username
      },
      createMsg () {
        return {
          message: this.message,
          clientTime: Date.now(),
          from: {
            type: 'broadcaster',
            username: this.broadcaster.username,
            slug: this.broadcaster.slug
          },
          to: this.currentRoom._id
        }
      },
      resetMsg () {
        this.message = ''
      },
      sendMessage () {
        this.$socket.emit('sendMessage', this.createMsg(), (err) => {
          if (!err) this.resetMsg()
        })
      },
      scrollToEnd () {
        var container = this.$el.querySelector('.message-list')
        if (container) container.scrollTop = container.scrollHeight
      }
    }
  }
</script>
<style>
  .message-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .message-list .tip {
    background-color: #fffd00
  }
</style>
