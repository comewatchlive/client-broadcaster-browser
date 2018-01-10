import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    broadcaster: {},
    user: {},
    chat: {
      selected: '',
      roomsList: [],
      rooms: {}
    }
  },
  getters: {
    chat: (state) => state.chat,
    chatRooms: (state) => state.chat.rooms,
    currentMessages: (state) => state.chat.rooms[state.chat.selected].messages,
    currentRoom: (state) => {
      if (state.chat.rooms && state.chat.selected) {
        return state.chat.rooms[state.chat.selected]
      } else {
        return null
      }
    },
    currentStatus: (state, getters) => {
      return (!getters.selectedRoom) ? 'offline' : (getters.currentRoom.isAway) ? 'Away' : getters.currentRoom.show
    },
    viewers: (state, getters) => (getters.currentRoom) ? getters.currentRoom.users.length : 0,
    broadcaster: state => state.broadcaster,
    getBroadcasterList: (state, id) => state.broadcasterLists[id],
    isLoggedIn: state => state.isLoggedIn,
    selectedRoom: state => state.chat.selected,
    user: state => state.user,
    broadcasterStatus: state => state.broadcaster.status,
    broadcasterOffline: (state) => !state.chat.selected,
    broadcasterPublic: (state, getters) => (getters.currentRoom) ? getters.currentRoom.show === 'public' : false,
    broadcasterAway: (state, getters) => (getters.currentRoom) ? getters.currentRoom.isAway : false
  },
  mutations: {
    resetUser: (state) => {
      Vue.set(state, 'isLoggedIn', false)
      Vue.set(state, 'user', {})
    },
    setUser: (state, user) => {
      Vue.set(state, 'user', user)

      if (state.user.isLoggedIn) Vue.set(state, 'isLoggedIn', true)
    },
    clearBroadcaster: (state) => {
      Vue.set(state, 'broadcaster', {})
    },
    rcvMsg: (state, msg) => {
      let chat = state.chat
      let room = chat.rooms[chat.selected]
      if (!room.messages) {
        Vue.set(room, 'messages', [msg])
      } else {
        let msgCount = room.messages.length
        Vue.set(room.messages, msgCount, msg)
      }
    },
    rcvTip: (state, msg) => {
      let chat = state.chat
      let room = chat.rooms[chat.selected]
      msg.msgType = 'tip'
      if (!room.messages) {
        Vue.set(room, 'messages', [msg])
      } else {
        let msgCount = room.messages.length
        Vue.set(room.messages, msgCount, msg)
      }
      console.log('rcvTip', msg)
    },
    removeChatRooms: (state, rooms) => {
      Vue.set(state, 'chat', {
        selected: '',
        roomsList: [],
        rooms: {}
      })
    },
    setChatRooms: (state, rooms) => {
      for (let r in rooms) {
        let room = rooms[r]
        let count = state.chat.roomsList.length
        Vue.set(state.chat.rooms, room._id, room)
        if (state.chat.roomsList.indexOf(room._id) === -1) Vue.set(state.chat.roomsList, count, room._id)
        if (state.chat.roomsList.length === 1) Vue.set(state.chat, 'selected', room._id)
      }
    },
    setPublicChatRoom: (state, room) => {
      let count = state.chat.roomsList.length
      Vue.set(state.chat.rooms, 'public', room)
      Vue.set(state.chat.roomsList, count, room.slug)
    },
    setMessages: (state, room, msgs) => {
      console.log(room, msgs)
      Vue.set(state.chat.rooms[room], 'messages', msgs)
    },
    setBroadcaster: (state, broadcaster) => {
      Vue.set(state, 'broadcaster', broadcaster)
    },
    updateTopic: (state, topic) => {
      console.log('updateTopic', topic)
      Vue.set(state.broadcaster, 'topic', topic)
    },
    updateViewers: (state, room) => {
      console.log('updateViewers', room)
      Vue.set(state.chat.rooms[room._id], 'users', room.users)
    },
    setBroadcasterStatus: (state, status) => {
      Vue.set(state.broadcaster, 'status', status)
    }
  }
})
