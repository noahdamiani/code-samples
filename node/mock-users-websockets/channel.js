/**
 * Channel that takes a list of shim users and a websocket.
 * Randomly emits add and remove user events,
 * but protects subscribed users until they disconnect.
 */
class Channel {
    constructor(users, sockets = []) {
        this.connectionCounter = 0
        this.sockets = sockets
        this.users = users
        this.channel = []
        this.counter = 0

        // Add a user every 4 seconds
        setInterval(() => {
            const user = this.users[this.counter]
            this.addToChannel(user)
            if (this.counter < this.users.length) this.counter++
            else this.counter = 0
        }, 4000)

        // Remove a user every 10 seconds
        setInterval(() => {
            if (this.channel && this.channel.length > 0) {
                const randomUserToleave = this.channel.length === 1 
                    ? 0 
                    : Math.floor(Math.random() * this.channel.length)
                this.removeFromChannel(randomUserToleave)
            }
        }, 10000)
    }

    removeFromChannel(userIndex) {
        const userToRemove = this.channel[userIndex]
        
        if (userToRemove && !userToRemove.subscribed) {
            this.channel.splice(userIndex, 1)
            this.send(JSON.stringify(this.channel))
        }
    }

    addToChannel(user) {
        // If the channel gets too big, remove 3 users
        if (this.channel.length > 5) {
            [0, 1, 2].forEach((i) => {
                this.removeFromChannel(i)
            })
        } else {
            this.channel.push(user)
        }

        // Send channel to client
        this.send()
    }

    subscribe(user) {
        const isSubscribed = this.channel.find((u) => u.username === user.username)
        
        if (!isSubscribed) {
            const protectedUser = {...user, subscribed: true}
            this.channel.push(protectedUser)
            this.send()
        }
    }

    unsubscribe(user) {
        const userToRemove = this.channel.findIndex(u => u.username === user.username)
        this.channel.splice(userToRemove, 1)
    }

    send(msg) {
        if (this.sockets && this.sockets.length > 0) {
            for (let socket in this.sockets) {
                this.sockets[socket].send(JSON.stringify(this.channel))
            }
        }
    }

    close(id, user = null) {
        if (this.sockets[id]) {
            this.sockets[id].close()
            delete this.sockets[id]
            if (user) this.unsubscribe(user)
            this.send()
            console.log("Client disconnected")
        }
    }

    registerSocket(socket) {
        socket.id = this.connectionCounter

        socket.on('close', () => {
            this.close(socket.id)
        })

        socket.on('message', msg => {
            const message = JSON.parse(msg)

            // User subscribes
            if (message.subscribe) {
                this.subscribe(message.subscribe)
            }

            // User unsubscribes
            if (message.unsubscribe) {
                this.close(socket.id, message.unsubscribe)
            }
        })

        // Store socket at provided id
        this.sockets[socket.id] = socket

        // Increment the connections counter
        this.connectionCounter++
    }
}

export default Channel
