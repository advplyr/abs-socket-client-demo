const io = require("socket.io-client")
const auth = require('./auth')
const config = require('./config.json')

let socket = null
let isConnected = false
let apiToken = null

function initializeSocket() {
  const serverAddress = `${config.protocol}://${config.hostname}:${config.port}`
  socket = io(serverAddress)
  console.log('Initializing socket', serverAddress)

  socket.on("connect", () => {
    console.log(`Socket connected with id ${socket.id}`)
    isConnected = true

    if (apiToken) {
      // If disconnected and re-connected we will have a new socket id
      //   so re-auth
      socket.emit('auth', apiToken)
    }
  })
  socket.on("disconnect", () => {
    console.log(`Socket disconnected`)
    isConnected = false
  })
  socket.on("connect_error", () => {
    console.error('Socket connection error')
    isConnected = false
  })

  socket.on('init', (data) => {
    console.log('User was authorized', data)
    socket.emit('message_all_users', { message: 'Hello World' })
  })

  socket.onAny((eventName, ...args) => {
    try {
      console.log(eventName, JSON.stringify(args, null, 2))
    } catch (error) {
      console.error('Non-json args for event', eventName)
      console.log(eventName, args)
    }
  })

  return waitForConnection()
}

async function waitForConnection(waits = 0) {
  if (isConnected) return true
  if (!isConnected && waits > 10) {
    console.error('Waited too long')
    return false
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return waitForConnection(++waits)
}

async function start() {
  const success = await initializeSocket()
  if (!success) {
    return
  }
  console.log('Socket connected now logging in')

  // Login to the abs server
  const userData = await auth.login()
  if (!userData) return
  apiToken = userData.user.token

  console.log('Login successful. API Token=', apiToken)

  // Auth event for connecting user to socket
  socket.emit('auth', apiToken)
}

start()