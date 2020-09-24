import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'

class MessagesHeader extends React.Component {
  render() {
    const {
      displayChannelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      isPrivateChannel,
      handleStar,
      isChannelStar,
    } = this.props
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
          <span>
            {displayChannelName}
            {!isPrivateChannel && (
              <Icon
                link
                onClick={handleStar}
                name={isChannelStar ? 'star' : 'star outline'}
                color={isChannelStar ? 'yellow' : 'black'}
              />
            )}
          </span>
          {!isPrivateChannel && (
            <Header.Subheader>{numUniqueUsers}</Header.Subheader>
          )}
        </Header>

        {/* Channel Search Input */}
        <Header floated='right'>
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
            size='mini'
            icon='search'
            name='searchTerm'
            placeholder='Search Messages'
          />
        </Header>
      </Segment>
    )
  }
}

export default MessagesHeader
