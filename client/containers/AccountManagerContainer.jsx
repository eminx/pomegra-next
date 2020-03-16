import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import {
  ActivityIndicator,
  List,
  Flex,
  Button,
  InputItem,
  NavBar,
  Modal,
  Toast,
  WingBlank,
  WhiteSpace
} from 'antd-mobile';

import CreateAccount from '../reusables/CreateAccount';
import AppTabBar from '../reusables/AppTabBar';
import { errorDialog } from '../functions';

class AccountManager extends Component {
  state = {
    loginScreenOpen: false,
    username: '',
    email: '',
    password: '',
    isLoading: false,
    redirectTo: null
  };

  createAccount = values => {
    this.setState({ isLoading: true });

    Meteor.call('registerUser', values, (error, respond) => {
      if (error) {
        console.log('error!!');
        console.log(error);
        errorDialog(error.reason);
        this.setState({ isLoading: false });
        return;
      }
      this.signIn(values);
      this.setState({
        isLoading: false,
        loginScreenOpen: false
      });
    });
  };

  signIn = values => {
    if (values) {
      Meteor.loginWithPassword(values.username, values.password, error => {
        if (error) {
          errorDialog(error);
          console.log(error);
        }
      });
    } else {
      const { username, password } = this.state;
      if (!username || !password) {
        return;
      }

      Meteor.loginWithPassword(username, password, error => {
        if (error) {
          errorDialog(error);
          console.log(error);
        }
      });
    }
  };

  signOut = () => {
    Meteor.logout();
  };

  forgotPassword = () => {};

  openLoginScreen = () => {
    this.setState({
      loginScreenOpen: true
    });
  };

  closeScreen = () => {
    this.setState({
      loginScreenOpen: false
    });
  };

  redirectTo = route => {
    this.setState({
      redirectTo: route
    });
  };

  render() {
    const { currentUser, isLoading } = this.props;
    const { loginScreenOpen, redirectTo } = this.state;

    // if (isLoading) {
    //   return (
    //     <div
    //       style={{
    //         display: 'flex',
    //         justifyContent: 'center',
    //         marginTop: 50
    //       }}
    //     >
    //       <ActivityIndicator text="Loading..." />
    //     </div>
    //   );
    // }

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
      <div>
        <NavBar mode="light">Your Account</NavBar>

        {!currentUser && (
          <div>
            <CreateAccount onSubmit={this.createAccount} />
            <div>
              <p style={{ textAlign: 'center' }}>
                <span>Already have an account?</span>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  inline
                  size="small"
                  onClick={() => this.openLoginScreen()}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
        <WhiteSpace />

        {currentUser && (
          <WingBlank size="lg">
            <Flex justify="center">
              <Button
                size="small"
                type="ghost"
                inline
                onClick={() => this.signOut()}
              >
                Sign out
              </Button>
            </Flex>
          </WingBlank>
        )}

        {currentUser && (
          <div>
            <List
              style={{
                backgroundColor: 'white',
                // position: 'fixed',
                // bottom: 50,
                marginTop: 200
              }}
            >
              <List.Item
                extra={
                  <Button size="small" onClick={() => this.redirectTo('/find')}>
                    Borrow
                  </Button>
                }
                multipleLine
              >
                Borrow
                <List.Item.Brief>
                  Borrow Books from others to Read
                  {/* You can borrow a book from your friends and others. See what
                  books people have */}
                </List.Item.Brief>
              </List.Item>

              <List.Item
                extra={
                  <Button
                    size="small"
                    onClick={() => this.redirectTo('/my-books')}
                  >
                    My Shelf
                  </Button>
                }
                multipleLine
              >
                Lend
                <List.Item.Brief>
                  Lend Books to Friends and neighbors
                  {/* You can virtualise your book shelf. Let the others see your
                  books and borrow from you. */}
                </List.Item.Brief>
              </List.Item>

              <List.Item
                extra={
                  <Button
                    size="small"
                    onClick={() => this.redirectTo('/messages')}
                  >
                    My Messages
                  </Button>
                }
                multipleLine
              >
                Message
                <List.Item.Brief>
                  Message with People
                  {/* For every book lending process, you can chat with others to
                  manage your book lending process */}
                </List.Item.Brief>
              </List.Item>
            </List>
          </div>
        )}

        <Modal
          visible={!currentUser && loginScreenOpen}
          // position="top"
          closable
          onClose={() => this.closeScreen()}
          title="Login to your account"
        >
          <List renderHeader={() => 'Please enter your credentials'}>
            <InputItem
              label="Username or email"
              type="text"
              placeholder="username or email"
              value={this.state.username}
              onInput={e => {
                this.setState({ username: e.target.value });
              }}
            />
            <InputItem
              label="Password"
              type="password"
              placeholder="Your password"
              value={this.state.password}
              onInput={e => {
                this.setState({ password: e.target.value });
              }}
            />
            <List.Item>
              <Button type="submit" onClick={() => this.signIn()} type="ghost">
                Login
              </Button>
            </List.Item>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                size="small"
                inline
                ghost
                onClick={() => this.forgotPassword()}
                style={{ margin: '16px 0' }}
              >
                Forgot Password
              </Button>
            </div>
          </List>
        </Modal>

        {currentUser && <AppTabBar />}
      </div>
    );
  }
}

export default AccountManagerContainer = withTracker(props => {
  const currentUserSub = Meteor.subscribe('me');
  console.log(currentUserSub);
  const currentUser = Meteor.user();
  const isLoading = !currentUserSub.ready();

  return {
    currentUser,
    isLoading
  };
})(AccountManager);
