module.exports = {
  api: {
    locations: {
      local: 'http://localhost:3010/',
      remote: 'http://ec2-18-217-63-171.us-east-2.compute.amazonaws.com:3010/'
    },
    env: 'remote',
    version: '1.0',
    getURL () {
      return this.locations[this.env] + this.version
    }
  }
}
