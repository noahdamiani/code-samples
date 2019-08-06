import React, { Component } from 'react'
import API from './ApiClient'

class App extends Component {
  api = new API()
  state = {
    connected: false,
    currentUser: null,
    channel: [],
    selectedActivity: null,
    inputActivity: "",
    activities: [
      "Whale Watching in Hawaii",
      "Atlantic Cruise",
      "Costa Rica Scuba Diving"
    ]
  }
  login = () => {
    this.api.login().then((currentUser) => {
      this.setState({...this.state, currentUser })
    })
  }
  logout = () => {
    if (this.api.connected) {
      this.disconnect()
    }
    this.setState({...this.state, currentUser: null })
  }
  connect = () => {
    this.api.subscribe(this.state.selectedActivity, {...this.state.currentUser}, () => {
      this.setState({...this.state, connected: true })
    })
    this.api.connection.onmessage = ({data}) => {
      this.setState({...this.state, channel: [...JSON.parse(data)] })
    }
  }
  disconnect = () => {
    this.api.unsubscribe({...this.state.currentUser}, () => {
      this.setState({...this.state, connected: false, channel: [] })
    })
  }
  addActivity = (e) => {
    this.setState({
      ...this.state, 
      activities: [...this.state.activities].concat([this.state.inputActivity]), 
      inputActivity: ""
    })
  }
  chooseActivity(selectedActivity) {
    this.setState({...this.state, selectedActivity })
  }
  updateInput = (e) => {
    this.setState({...this.state, inputActivity: e.target.value})
  }
  channelMessage() {
    let msg = "Please select a channel."
    const len = this.state.channel.length - 1

    if (this.state.connected) {
      if (len <= 0) msg = "You are the only person booking in this channel."
      else if (len === 1) msg = "There is one other person booking right now."
      else msg = `There are ${len} other receptionists booking right now.`
    }

    return (
      msg
    )
  }
  withoutCurrentUser(channel) {
    if (!this.state.currentUser) return [...channel]
    return [...channel].filter(user => user.username !== this.state.currentUser.username)
  }
  activeClass = (activity) => activity === this.state.selectedActivity ? "activity active" : "activity"
  render = () => (
    <div className="App">
      <header>
        <h1>Reception Desk</h1>
      </header>
      <main>
        {!this.state.currentUser ? 
          <div>
            <h1>You are not logged in</h1>
            <button onClick={this.login}>login</button>  
          </div> : 
          <div>
            {this.state.connected ? <h1>{this.state.selectedActivity}</h1> : ""}
            <h2>Hello {this.state.currentUser.name}! {this.channelMessage()}</h2>
            <div>
              <div className="bottom-bar">
                {!this.state.connected ? <button onClick={this.connect}>Connect to channel</button> : <button onClick={this.disconnect}>Disconnect</button>}
                {this.state.currentUser != null ? <button onClick={this.logout}>Log out</button> : ""}
              </div>
              {this.state.connected ? this.withoutCurrentUser(this.state.channel).map(user => 
                user ? 
                <div className="user" key={user.username}>
                  <span><img src={user.userImg} alt={user.name} /></span>
                  <div className="hover">
                    <span>{user.name}<br />{user.username}</span>
                  </div>
                </div> : ""
              ) : <div>
                {this.state.activities.map(activity =>
                  <div className={this.activeClass(activity)} key={activity} onClick={() => this.chooseActivity(activity)}>{activity}</div>
                )}
                <h2>Don't see what you're looking for? Add an activity:</h2>
                
                <div className="form-field">
                  <input type="text" value={this.state.inputActivity} onChange={this.updateInput} />
                  <button onClick={this.addActivity}>add</button>
                </div>

                {this.state.selectedActivity ? <div className="connect">
                  <button onClick={this.connect}>Connect</button>
                </div> : ""}
              </div>}
            </div>  
          </div>
        }
      </main>
     
    </div>
  )
}

export default App
