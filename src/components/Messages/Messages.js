import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'

class Messages extends React.Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privetMessages'),
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    isChannelStar: false,
    user: this.props.currentUser,
    userRef: firebase.database().ref('users'),
    numUniqueUsers: 0,
    progressBar: false,
    searchTerm: '',
    searchLoading: false,
    searchResult: [],
  }

  componentDidMount() {
    const { channel, user } = this.state

    if (channel && user) {
      this.addListeners(channel.id)
      this.addStarredListeners(channel.id, user.uid)
    }
  }

  addStarredListeners = (channelId, userId) => {
    this.state.userRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if(data.val() !== null) {
          const channelIds = Object.keys(data.val())
          const prevStarred = channelIds.includes(channelId)
          this.setState({isChannelStar: prevStarred})
        }
      })
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId)
  }

  addMessageListener = (channelId) => {
    let loadedMessages = []
    const ref = this.getMessagesRef()
    ref.child(channelId).on('child_added', (snap) => {
      loadedMessages.push(snap.val())
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      })
      this.countUniqueUsers(loadedMessages)
    })
  }

  handleStar = () => {
    this.setState(prevState => ({
      isChannelStar: !prevState.isChannelStar
    }), () => this.starChannel())
  }

  starChannel = () => {
    if(this.state.isChannelStar) {
      this.state.userRef
        .child(`${this.state.user.uid}/starred`)
        .update({
          [this.state.channel.id]: {
            name: this.state.channel.name,
            details: this.state.channel.details,
            createdBy: {
              name: this.state.channel.createdBy.name,
              avatar: this.state.channel.createdBy.avatar
            }
          }
        })
    } else {
      this.state.userRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if(err !== null) {
            console.error(err)
          }
        })
    }
  }

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc
    }, [])
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0
    const numUniqueUsers = `${uniqueUsers.length} User${plural ? 's' : ''}`
    this.setState({ numUniqueUsers })
  }

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    )
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages]
    const regex = new RegExp(this.state.searchTerm, 'gi')
    const searchResult = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message)
      }
      return acc
    }, [])
    this.setState({ searchResult })
    setTimeout(() => {
      this.setState({ searchLoading: false })
    }, 500)
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state
    return privateChannel ? privateMessagesRef : messagesRef
  }

  displayChannelName = (channel) => {
    return channel
      ? `${this.state.privateChannel ? '@' : '#'}${channel.name}`
      : ''
  }

  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ))

  isProgressBarVisible = (percent) => {
    if (percent > 0) {
      this.setState({ progressBar: true })
    }
  }

  render() {
    const {
      messagesRef,
      messages,
      channel,
      user,
      numUniqueUsers,
      searchResult,
      searchTerm,
      searchLoading,
      privateChannel,
      isChannelStar
    } = this.state

    return (
      <React.Fragment>
        <MessagesHeader
          displayChannelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          isChannelStar={isChannelStar}
          handleStar={this.handleStar}
        />

        <Segment>
          <Comment.Group className='messages'>
            {searchTerm
              ? this.displayMessages(searchResult)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isProgressBarVisible={this.isProgressBarVisible}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    )
  }
}

export default Messages
