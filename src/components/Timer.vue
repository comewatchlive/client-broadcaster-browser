<template>
  <span v-html='time'></span>
</template>

<style>

</style>

<script>
  import {event} from '../utils/event'
  export default {
    props: ['id'],
    data () {
      return {
        state: 'stopped',
        startTime: null,
        currentTime: null,
        interval: null,
        pauses: []
      }
    },
    mounted () {
      event.on('timer/pause', this.pause)
      event.on('timer/start', this.start)
      event.on('timer/stop', this.stop)
      event.on('timer/reset', this.reset)
    },
    destroyed () {
      this.stop()
    },
    computed: {
      time () {
        let hr = this.getFormattedNumber(this.hours)
        let min = this.getFormattedNumber(this.minutes)
        let sec = this.getFormattedNumber(this.seconds)
        let t = hr + ':' + min + ':' + sec
        return t
      },
      milliseconds () {
        return this.currentTime - this.startTime
      },
      hours () {
        var lapsed = this.milliseconds
        var hrs = Math.floor((lapsed / 1000 / 60 / 60))
        return hrs >= 10 ? hrs : '0' + hrs
      },
      minutes () {
        var lapsed = this.milliseconds
        var min = Math.floor((lapsed / 1000 / 60) % 60)
        return min >= 10 ? min : '0' + min
      },
      seconds () {
        var lapsed = this.milliseconds
        var sec = Math.ceil((lapsed / 1000) % 60)
        return sec >= 10 ? sec : '0' + sec
      }
    },
    methods: {
      getFormattedNumber (a) {
        return (a && a.toString().indexOf('-') > -1) ? '00' : a
      },
      start () {
        this.state = 'started'
        this.startTime = Date.now()
        this.interval = setInterval(this.updateCurrentTime, 1000)
      },
      stop () {
        clearInterval(this.interval)
      },
      reset () {
        if (this.interval) this.stop()
        this.state = 'stopped'
        this.pauses = []
        this.startTime = null
        this.currentTime = null
      },
      pause () {
        let pause = {start: this.startTime, end: this.currentTime, lapsed: this.time}
        this.pauses.push(pause)
        this.state = 'paused'
        console.log(this.pauses)
      },
      updateCurrentTime () {
        if (this.state === 'started') {
          this.currentTime = Date.now()
        }
      }
    }
  }
</script>
