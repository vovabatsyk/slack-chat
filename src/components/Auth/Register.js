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
import md5 from 'md5'

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    )
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false
    } else if (password !== passwordConfirmation) {
      return false
    } else {
      return true
    }
  }

  isFormValid = () => {
    let errors = []
    let error
    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid' }
      this.setState({ errors: errors.concat(error) })
    } else {
      return true
    }
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

  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved')
                this.setState({ loading: false })
              })
            })
            .catch((err) => {
              console.error(err)
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              })
            })
          console.log(createdUser)
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

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state
    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='blue' textAlign='center'>
            <Icon name='wechat' color='blue'></Icon>
            Register for LiveChat
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}
                type='text'
                value={username}
              ></Form.Input>
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
              <Form.Input
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={this.handleChange}
                type='password'
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
              ></Form.Input>
              <Button
                fluid
                color='blue'
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
            Already a user? <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
export default Register
