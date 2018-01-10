<template>
  <div>
    <ul class="message-list" v-if="currentRoom">
      <li v-for="msg in currentRoom.messages" :key="msg._id" :class="{tip: (msg.msgType === 'tip')}">
        <b>{{msg.from.username}}:</b>
        <span v-if="msg.msgType === 'tip'">
          Tipped {{msg.amount}}
        </span>
        <span v-else>
          {{msg.message}}
        </span>
      </li>
    </ul>
    <form action="#" @submit.prevent="sendMessage">
      <input v-model="message" name="content"/>
      <button>Send</button>
    </form>
    <ul>

    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'chatRooms',
        'currentMessages',
        'currentRoom',
        'broadcaster',
        'user',
        'selectedRoom'
      ])
    },
    updated () {
      this.scrollToEnd()
    },
    data () {
      return {
        message: null
      }
    },
    sockets: {
      transmitMsg (msg) {
        this.$store.commit('updateMessages', msg)
      },
      transmitTip (msg) {
        this.$store.commit('rcvTip', msg)
      }
    },
    methods: {
      scrollToEnd: function () {
        var container = this.$el.querySelector('.message-list')
        if (container) container.scrollTop = container.scrollHeight
      },
      sendMessage () {
        let msg = {
          message: this.message,
          clientTime: Date.now(),
          from: {
            type: 'broadcaster',
            username: this.broadcaster.username,
            slug: this.broadcaster.slug
          },
          to: this.currentRoom._id
        }

        this.$socket.emit('sendMessage', msg, (err) => {
          if (!err) {
            this.message = null
          }
        })
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
