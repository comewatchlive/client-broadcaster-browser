export default {
  data () {
    return {
      duration: 1
    }
  },
  methods: {
    convertToMinutes (milliseconds) {
      return milliseconds * 1000 * 60
    },
    isNumeric (num) {
      return !isNaN(parseFloat(num)) && isFinite(num)
    },
    init (params){
      if (this.isNumeric(params)){
        this.duration = params
      } else {
        if (params.duration && this.isNumeric(params.duration)) {
          this.duration = params.duration
        }
      }
    },
    timeoutSetup (params) {
      window.addEventListener('mousemove', this.resetTimer, false)
      window.addEventListener('mousedown', this.resetTimer, false)
      window.addEventListener('keypress', this.resetTimer, false)
      window.addEventListener('DOMMouseScroll', this.resetTimer, false)
      window.addEventListener('mousewheel', this.resetTimer, false)
      window.addEventListener('touchmove', this.resetTimer, false)
      window.addEventListener('MSPointerMove', this.resetTimer, false)

      this.startTimer()
    },

    startTimer () {
      let t = this.convertToMinutes(this.inactiveSeconds)
      console.log('start', t, new Date())
      this.timeoutWarningID = window.setTimeout(this.goInactive, t)
    },

    resetTimer () {
      window.clearTimeout(this.timeoutWarningID)
      this.goActive()
    },

    goInactive () {
      // do something
      console.log('INACTIVE You will be logged off in 3 mins')
      let t = this.convertToMinutes(this.logoffSeconds)
      console.log('inactive', t, new Date())
      this.timeoutLogoffID = window.setTimeout(this.logout, t)
    },
    goActive () {
      this.startTimer()
    }
  }
}
