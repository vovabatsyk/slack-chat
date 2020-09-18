import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
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
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId)
  }

  addMessageListener = (channelId) => {
    let loadedMessages = []
    this.state.messagesRef.child(channelId).on('child_added', (snap) => {
      loadedMessages.push(snap.val())
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      })
      this.countUniqueUsers(loadedMessages)
    })
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

  displayChannelName = (channel) => (channel ? `#${channel.name}` : '')

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
    } = this.state

    return (
      <React.Fragment>
        <MessagesHeader
          displayChannelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
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
        />
      </React.Fragment>
    )
  }
}

export default Messages
