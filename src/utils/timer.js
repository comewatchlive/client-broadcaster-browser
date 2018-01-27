export default {
  data () {
    return {
      inactiveSeconds: 25,
      listenEvents: [
        'mousemove',
        'mousedown',
        'keypress',
        'DOMMouseScroll',
        'mousewheel',
        'touchmove',
        'MSPointerMove'
      ],
      logoffSeconds: 5,
      timeoutWarningID: null,
      timeoutLogoffID: null
    }
  },
  methods: {
    convertToMinutes (milliseconds) {
      return milliseconds * 1000 * 60
    },
    timeoutSetup () {
      for (let i in this.listenEvents) {
        let evt = this.listenEvents[i]
        window.addEventListener(evt, this.resetTimer)
      }

      this.startTimer()
    },

    destroy () {
      for (let i in this.listenEvents) {
        let evt = this.listenEvents[i]
        window.removeEventListener(evt, this.resetTimer)
      }
    },

    logoutAndDestroy () {
      this.clearNotification()
      this.$notify({
        group: 'foo',
        title: 'Are you still there?',
        text: 'We\'ve logged you off due to inactivity',
        duration: -1,
        type: 'error'
      })
      console.log('logout', new Date())
      this.destroy()
      this.logout()
    },

    clearNotification () {
      this.$notify({
        group: 'foo',
        clean: true
      })
    },

    startTimer () {
      console.log('start', new Date())
      this.clearNotification()
      let t = this.convertToMinutes(this.inactiveSeconds)
      this.timeoutWarningID = window.setTimeout(this.goInactive, t)
    },

    resetTimer () {
      window.clearTimeout(this.timeoutWarningID)
      window.clearTimeout(this.timeoutLogoffID)
      this.goActive()
    },

    goInactive () {
      console.log('inactive', new Date())
      this.$notify({
        group: 'foo',
        title: 'Are you still there?',
        text: 'If you do not interact with this app soon, you will be logged off.',
        duration: -1,
        type: 'error'
      })
      let t = this.convertToMinutes(this.logoffSeconds)
      this.timeoutLogoffID = window.setTimeout(this.logoutAndDestroy, t)
    },
    goActive () {
      this.startTimer()
    }
  }
}
