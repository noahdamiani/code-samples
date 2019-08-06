import config from './config.json'

class API {
    constructor() {
        this.connected = false
        this.host = config.host
        this.port = config.port
        this.wss = config.wss
        this.connection = null
    }

    endpoint = (path = "") => `${this.host}:${this.port}${path}`
    
    ws = (path = "/channel") => `${this.wss}:${this.port}${path}`

    getUsers() {
        return fetch(this.endpoint('/users'))
            .then(res => res.json())
    }

    login() {
        return fetch(this.endpoint('/users/1'))
            .then(res => res.json())
    }

    unsubscribe = (currentUser, callback) => {
        this.connection.send(JSON.stringify({
            "unsubscribe": currentUser
        }))
        this.connection.close()
        this.connected = false
        callback()
    }

    subscribe(channel, currentUser, callback) {
        if (!this.connected) {
            this.connection = new WebSocket(this.ws(`/channel/${channel}`))
            this.connection.onopen = () => {
                this.connection.send(JSON.stringify({
                    "subscribe": currentUser
                }))
            }
            this.connected = true
            callback()
        } else {
            console.log('client is already connected')
        }
    }
}

export default API
