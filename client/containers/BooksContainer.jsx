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
  ListInput,
} from 'framework7-react';

import { Books } from '../../imports/api/collections';

class Info extends Component {
  state = {
    loginScreenOpened: false,
    usernameOrEmail: '',
    password: '',
  };

  componentDidMount() {
    this.$f7router.navigate('/cc/');
  }

  signIn() {
    const self = this;
    const app = self.$f7;
    const { usernameOrEmail, password } = this.state;
    const user = {
      usernameOrEmail,
      password,
    };

    Meteor.loginWithPassword(usernameOrEmail, password, (error, respond) => {
      console.log(error, respond);
    });

    // app.dialog.alert(
    //   `Username: ${self.state.username}<br>Password: ${self.state.password}`,
    //   () => {
    //     app.loginScreen.close();
    //   }
    // );
  }

  render() {
    const { books, currentUser } = this.props;
    return (
      <Page name="books">
        <Navbar title="My books" backLink></Navbar>

        <Block>
          <Button
            raised
            large
            fill
            onClick={() => {
              this.setState({ loginScreenOpened: true });
            }}
          >
            Open Via Prop Change
          </Button>
        </Block>

        <LoginScreen
          opened={this.state.loginScreenOpened}
          onLoginScreenClosed={() => {
            this.setState({ loginScreenOpened: false });
          }}
        >
          <LoginScreenTitle>Login</LoginScreenTitle>
          <List form>
            <ListInput
              label="Username or Email"
              type="text"
              placeholder="Your username or email address"
              value={this.state.usernameOrEmail}
              onInput={e => {
                this.setState({ usernameOrEmail: e.target.value });
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
            <ListButton onClick={this.signIn.bind(this)}>Sign In</ListButton>
            <BlockFooter>
              Some text about login information.
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </BlockFooter>
          </List>
        </LoginScreen>
        <Toolbar bottom>
          <Link>Link 1</Link>
          <Link>Link 2</Link>
        </Toolbar>
        {/* Page Content */}
      </Page>
    );
  }

  makeLink(book) {
    return (
      <li key={book._id}>
        <a href={book.url} target="_blank">
          {book.title}
        </a>
      </li>
    );
  }
}

export default BooksContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const books = Books.find().fetch();
  return {
    books,
    currentUser,
  };
})(Info);
