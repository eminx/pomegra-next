import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
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
    username: '',
    email: '',
    password: '',
    isLoading: false,
  };

  createAccount() {
    const self = this;
    const app = self.$f7;
    const { username, email, password } = this.state;
    const newUser = {
      username,
      email,
      password,
    };
    this.setState({ isLoading: true });
    Meteor.call('registerUser', newUser, (error, respond) => {
      console.log(error, respond);
      if (!error) {
        this.setState({
          isLoading: false,
        });
      }
    });

    // app.dialog.alert(
    //   `Username: ${self.state.username}<br>Password: ${self.state.password}`,
    //   () => {
    //     app.loginScreen.close();
    //   }
    // );
  }

  render() {
    const { currentUser } = this.props;
    const { isLoading } = this.state;

    return (
      <Page name="create-account">
        <Block strong>
          {isLoading && <Progressbar infinite color="multi"></Progressbar>}
        </Block>

        <Appbar title="Create an account" />
        <Navbar>
          <Link href="/add/">Add book</Link>
          <Link href="/books/">See books</Link>
        </Navbar>
        <LoginScreen opened={false}>
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
            <ListButton onClick={this.createAccount.bind(this)}>
              Sign In
            </ListButton>
            <BlockFooter>Viva libra</BlockFooter>
          </List>
        </LoginScreen>
        {/* Page Content */}
      </Page>
    );
  }
}

export default CreateAccountContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  console.log('currentUser', currentUser);
  return {
    currentUser,
  };
})(CreateAccount);
