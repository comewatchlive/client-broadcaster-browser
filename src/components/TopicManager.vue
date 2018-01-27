<template>
  <div>
    <strong>Topic:</strong>
    <p v-if="currentRoom.topic">{{currentRoom.topic}}</p>
    <input type="text" name="topic" class="topic-manager" v-model="topic">
    <button class="btn-primary" @click="save()">Save</button>
    <button class="btn-danger" @click="reset()">Cancel</button>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        broadcaster: 'broadcaster',
        chat: 'chat',
        currentRoom: 'chat/currentRoom'
      })
    },
    created () {
      this.reset()
    },
    data () {
      return {
        topic: null
      }
    },
    methods: {
      ...mapActions([
        'updateTopic'
      ]),
      reset () {
        Vue.set(this, 'topic', this.broadcaster.topic)
      },
      save () {
        let obj = {
          _id: this.currentRoom._id,
          topic: this.topic
        }
        this.$socket.emit('updateTopic', obj, (ret) => { console.log(ret) })
      }
    }
  }
</script>
