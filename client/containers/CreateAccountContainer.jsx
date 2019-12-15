import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Appbar,
  Block,
  Page,
  Navbar,
  Toolbar,
  Button,
  Link,
  BlockTitle,
  List,
  LoginScreen,
  LoginScreenTitle,
  BlockFooter,
  ListButton,
  Range,
  ListItem,
  Progressbar,
  ListInput,
} from 'framework7-react';

import { Books } from '../../imports/api/collections';

class CreateAccount extends Component {
  state = {
    loginScreenOpen: false,
    username: '',
    email: '',
    password: '',
    isLoading: false,
    loginScreenType: null,
  };

  createAccount = () => {
    const { username, email, password } = this.state;
    const newUser = {
      username,
      email,
      password,
    };
    console.log(username, email, password);
    this.setState({ isLoading: true });
    Meteor.call('registerUser', newUser, (error, respond) => {
      console.log(error);
      console.log(respond);
      if (!error) {
        this.setState({
          isLoading: false,
        });
      }
    });
  };

  handleAuth = () => {
    const { loginScreenType } = this.state;
    if (loginScreenType === 'login') {
      this.signIn();
    } else if (loginScreenType === 'signup') {
      this.createAccount();
    } else {
      return;
    }
  };

  signIn = () => {
    const self = this;
    const app = self.$f7;

    const { username, password } = this.state;
    if (!username || !password) {
      return;
    }

    Meteor.loginWithPassword(username, password, error => {
      if (error) {
        console.log(error);
        app.dialog.alert('Please enter valid credentials', () => {
          this.setState({
            loginScreenOpen: false,
          });
        });
      }
    });
  };

  signOut = () => {
    Meteor.logout();
  };

  render() {
    const { currentUser } = this.props;
    const { isLoading, loginScreenOpen, loginScreenType } = this.state;

    return (
      <Page name="create-account">
        <Navbar title={currentUser ? 'Welcome' : 'Create an account'} />

        {currentUser && (
          <Block>
            <Button large onClick={() => this.signOut()}>
              Log out
            </Button>
          </Block>
        )}

        <Block>
          {!currentUser && (
            <Fragment>
              <Button
                round
                large
                fill
                raised
                outline
                onClick={() =>
                  this.setState({
                    loginScreenOpen: true,
                    loginScreenType: 'signup',
                  })
                }
              >
                Create an Account
              </Button>
              <Button
                style={{ marginTop: 24 }}
                large
                onClick={() =>
                  this.setState({
                    loginScreenOpen: true,
                    loginScreenType: 'login',
                  })
                }
              >
                Login
              </Button>
            </Fragment>
          )}
        </Block>

        <LoginScreen opened={loginScreenOpen}>
          {loginScreenType === 'signup' ? (
            <Fragment>
              <LoginScreenTitle>Create an Account</LoginScreenTitle>
              <List form>
                <ListInput
                  label="Username"
                  type="text"
                  placeholder="Your username"
                  value={this.state.username}
                  onInput={e => {
                    this.setState({ username: e.target.value });
                  }}
                />
                <ListInput
                  label="Email"
                  type="email"
                  placeholder="Your email address"
                  value={this.state.email}
                  onInput={e => {
                    this.setState({ email: e.target.value });
                  }}
                />
                <ListInput
                  label="Password"
                  type="password"
                  placeholder="Your password"
                  value={this.state.password}
                  onInput={e => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </List>
              <List>
                <ListButton onClick={this.handleAuth.bind(this)}>
                  Sign Up
                </ListButton>
                <BlockFooter>
                  <Link
                    onClick={() =>
                      this.setState({
                        loginScreenOpen: false,
                        loginScreenType: null,
                      })
                    }
                  >
                    Close
                  </Link>
                </BlockFooter>
              </List>
            </Fragment>
          ) : (
            <Fragment>
              <LoginScreenTitle>Login to Your Account</LoginScreenTitle>
              <List form>
                <ListInput
                  label="Username or email"
                  type="text"
                  placeholder="username or email"
                  value={this.state.username}
                  onInput={e => {
                    this.setState({ username: e.target.value });
                  }}
                />
                <ListInput
                  label="Password"
                  type="password"
                  placeholder="Your password"
                  value={this.state.password}
                  onInput={e => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </List>
              <List>
                <ListButton onClick={this.handleAuth.bind(this)}>
                  Login
                </ListButton>
                <BlockFooter>
                  <Link
                    onClick={() =>
                      this.setState({
                        loginScreenOpen: false,
                        loginScreenType: null,
                      })
                    }
                  >
                    Close
                  </Link>
                </BlockFooter>
              </List>
            </Fragment>
          )}
        </LoginScreen>

        <Toolbar position="bottom">
          <Link href="/add/">Add book</Link>
          <Link href="/find/">Find</Link>
          <Link href="/my-books/">My books</Link>
          <Link href="/requests/">Requests</Link>
        </Toolbar>
      </Page>
    );
  }
}

export default CreateAccountContainer = withTracker(props => {
  Meteor.subscribe('me');
  const currentUser = Meteor.user();
  return {
    currentUser,
  };
})(CreateAccount);
