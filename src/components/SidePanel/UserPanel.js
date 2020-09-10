import React from 'react'
import firebase from '../../firebase'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }

    componentDidMount() {
        this.setState({user: this.props.currentUser})
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change avatar</span>,
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout}>Sign out</span>,
        }
    ]

    handleSignout = () => {
        firebase.auth().signOut().then(()=>console.log("Signout"))
    }

    render() {
        const { user } = this.state

        return (
            <Grid style={{background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{padding: '1.2rem', margin: 0}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code"/>
                            <Header.Content>LiveChat</Header.Content>
                        </Header>
                    </Grid.Row>
                    <Header style={{padding: '0.25em'}} as="h4" inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={user.photoURL} spaced="right" avatar />
                                {user.displayName}
                            </span>
                            } 
                            options={this.dropdownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel