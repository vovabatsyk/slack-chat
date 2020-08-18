import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react'
import firebase from '../../firebase'

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : ''
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedUser) => {
          console.log(signedUser)
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          })
        })
    }
  }

  isFormValid = ({ email, password }) => email && password

  render() {
    const { email, password, errors, loading } = this.state
    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='violet' textAlign='center'>
            <Icon name='rocketchat' color='violet'></Icon>
            Login to LiveChat
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email address'
                onChange={this.handleChange}
                type='email'
                value={email}
                className={this.handleInputError(errors, 'email')}
              ></Form.Input>
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
                type='password'
                value={password}
                className={this.handleInputError(errors, 'password')}
              ></Form.Input>

              <Button
                fluid
                color='violet'
                size='large'
                className={loading ? 'loading' : ''}
                disabled={loading}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Don't have an account? <Link to='/register'>Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
export default Login
