import UserGenerator from "./user-generator"
import config from "../client/src/config.json"
import cors from "cors"
import express from "express"
import expressWebSocket from "express-ws"
import Channel from "./channel"

// Initialize user generator
const $userGenerator = new UserGenerator()

// Generate 100 users for the mock API
const users = $userGenerator.generate(100)

// Initialize the express API
const api = express()

// Channels object to store new channels in by name
const channels = {}

// Attach CORS middleware
api.use(cors())

// Attach WebSocket
const wss = expressWebSocket(api)

// Get a list of users
api.get('/users', (req, res) => {
    return res.send(users)
})

// Get a singular user with a provided id
api.get('/users/:userId', (req, res) => {
    const usr = {...users[req.params.userId]}
    users.splice(req.params.userId, 1)
    res.send(usr)
})

api.ws('/channel/:channelName', (ws, req) => {
    console.log(`Incoming request to channel ${req.params.channelName}`)

    // Slug with whitespace removed
    const slug = req.params.channelName.replace(/\s/g, '')

    // Channel does not exist, create it
    if (!channels[slug]) {
        console.log(`${req.params.channelName} does not exist, creating!`)
        channels[slug] = new Channel(users)
    } else {
        console.log(`connecting to ${req.params.channelName}`, channels[slug].channel)
    }

    channels[slug].registerSocket(ws)
})

// Start the API
api.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})
