import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { List, Button, InputItem, NavBar, Modal, Toast } from 'antd-mobile';
import CreateAccount from '../reusables/CreateAccount';
import AppTabBar from '../reusables/AppTabBar';

class AccountManager extends Component {
  state = {
    loginScreenOpen: false,
    signupScreenOpen: false,
    username: '',
    email: '',
    password: '',
    isLoading: false
  };

  createAccount = values => {
    this.setState({ isLoading: true });

    Meteor.call('registerUser', values, (error, respond) => {
      if (error) {
        console.log('error!!');
        console.log(error);
        // app.dialog.alert(`${error.reason}, please try again`, 'Error', () => {
        //   console.log(error.reason);
        // });
        this.setState({ isLoading: false });
        return;
      }
      this.signIn();
      this.setState({
        isLoading: false,
        loginScreenOpen: false
      });
    });
  };

  signIn = () => {
    const { username, password } = this.state;
    if (!username || !password) {
      return;
    }

    Meteor.loginWithPassword(username, password, error => {
      if (error) {
        // app.dialog.alert(`${error.reason}, please try again`, 'Error', () => {
        console.log(error.reason);
        // });
      }
    });
  };

  signOut = () => {
    Meteor.logout();
  };

  openSignupScreen = () => {
    this.setState({
      signupScreenOpen: true
    });
  };

  openLoginScreen = () => {
    this.setState({
      loginScreenOpen: true
    });
  };

  closeScreens = () => {
    this.setState({
      signupScreenOpen: false,
      loginScreenOpen: false
    });
  };

  render() {
    const { currentUser, isLoading } = this.props;
    const { signupScreenOpen, loginScreenOpen } = this.state;

    // if (isLoading) {
    //   return (
    //     <div
    //       style={{
    //         display: 'flex',
    //         justifyContent: 'center',
    //         height: '100vh',
    //         marginTop: 'calc(50vh - 24px)'
    //       }}
    //     >
    //       <Preloader size={48} color="multi"></Preloader>
    //     </div>
    //   );
    // }

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
                <a onClick={() => this.openLoginScreen()}>Login</a>
              </div>
            </div>
          </div>
        )}

        <Modal visible={!currentUser && loginScreenOpen} position="top">
          <List>
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
            <div>
              <Button
                type="submit"
                onClick={this.signIn.bind(this)}
                style={{ margin: '0 16px' }}
              >
                Login
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                size="small"
                inline
                ghost
                onClick={() => this.closeScreens()}
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </List>
        </Modal>

        <AppTabBar />
      </div>
    );
  }
}

export default AccountManagerContainer = withTracker(props => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const isLoading = !currentUserSub.ready();

  return {
    currentUser,
    isLoading
  };
})(AccountManager);
