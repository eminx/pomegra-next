import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Block,
  Page,
  Navbar,
  Toolbar,
  Icon,
  Button,
  Link,
  List,
  LoginScreen,
  LoginScreenTitle,
  BlockFooter,
  ListItem,
  ListInput,
  Preloader
} from 'framework7-react';

class CreateAccount extends Component {
  state = {
    loginScreenOpen: false,
    username: '',
    email: '',
    password: '',
    isLoading: true,
    loginScreenType: null
  };

  handleAuth = event => {
    event.preventDefault();
    const { loginScreenType } = this.state;
    if (loginScreenType === 'login') {
      this.signIn();
    } else if (loginScreenType === 'signup') {
      this.createAccount();
    } else {
      return;
    }
  };

  createAccount = () => {
    const { username, email, password } = this.state;
    const newUser = {
      username,
      email,
      password
    };
    this.setState({ isLoading: true });

    const self = this;
    const app = self.$f7;

    Meteor.call('registerUser', newUser, (error, respond) => {
      if (error) {
        console.log('error!!');
        console.log(error);
        app.dialog.alert(`${error.reason}, please try again`, 'Error', () => {
          console.log(error.reason);
        });
      } else {
        this.signIn();
        this.setState({
          isLoading: false,
          loginScreenOpen: false
        });
      }
    });
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
        app.dialog.alert(`${error.reason}, please try again`, 'Error', () => {
          console.log(error.reason);
        });
      }
    });
  };

  signOut = () => {
    Meteor.logout();
  };

  render() {
    const { currentUser, isLoading } = this.props;
    const { loginScreenOpen, loginScreenType } = this.state;

    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            marginTop: 'calc(50vh - 24px)'
          }}
        >
          <Preloader size={48} color="multi"></Preloader>
        </div>
      );
    }

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
        {!currentUser && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 16
            }}
          >
            <Button
              round
              large
              fill
              raised
              outline
              onClick={() =>
                this.setState({
                  loginScreenOpen: true,
                  loginScreenType: 'signup'
                })
              }
            >
              Create an Account
            </Button>
            <Button
              style={{ marginTop: 16 }}
              large
              onClick={() =>
                this.setState({
                  loginScreenOpen: true,
                  loginScreenType: 'login'
                })
              }
            >
              Login
            </Button>
          </div>
        )}

        {!currentUser && (
          <LoginScreen opened={loginScreenOpen}>
            {loginScreenType === 'signup' && (
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
                  <Button
                    onClick={this.handleAuth.bind(this)}
                    fill
                    style={{ margin: '0 16px' }}
                  >
                    Sign Up
                  </Button>
                  <BlockFooter>
                    <Button
                      onClick={() =>
                        this.setState({
                          loginScreenOpen: false,
                          loginScreenType: null
                        })
                      }
                      style={{ marginTop: 16 }}
                    >
                      Close
                    </Button>
                  </BlockFooter>
                </List>
              </Fragment>
            )}

            {loginScreenType === 'login' && (
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
                  <ListItem>
                    <Button
                      type="submit"
                      fill
                      onClick={this.handleAuth.bind(this)}
                      style={{ margin: '0 16px' }}
                    >
                      Login
                    </Button>
                  </ListItem>

                  <BlockFooter>
                    <Button
                      onClick={() =>
                        this.setState({
                          loginScreenOpen: false,
                          loginScreenType: null
                        })
                      }
                      style={{ marginTop: 16 }}
                    >
                      Close
                    </Button>
                  </BlockFooter>
                </List>
              </Fragment>
            )}
          </LoginScreen>
        )}

        {currentUser && (
          <Toolbar position="bottom">
            <Link href="/add/">Add book</Link>
            <Link href="/find/">Find</Link>
            <Link href="/my-books/">My books</Link>
            <Link href="/requests/">Requests</Link>
          </Toolbar>
        )}
      </Page>
    );
  }
}

export default CreateAccountContainer = withTracker(props => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const isLoading = !currentUserSub.ready();

  return {
    currentUser,
    isLoading
  };
})(CreateAccount);
