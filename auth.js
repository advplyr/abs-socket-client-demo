const http = require('http')
const https = require('https')
const config = require('./config.json')


function login() {
  return new Promise((resolve) => {
    const options = {
      hostname: config.hostname,
      port: config.port,
      path: '/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    const protocol = config.protocol == 'http' ? http : https
    const req = protocol.request(options, (res) => {
      let str = ''
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        str += chunk
      })
      res.on('end', function () {
        resolve(JSON.parse(str))
      })
    })
    req.write(JSON.stringify({ username: config.username, password: config.password }))
    req.end()
  })
}

module.exports.login = login