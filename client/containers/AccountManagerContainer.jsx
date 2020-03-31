import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import {
  Carousel,
  ActivityIndicator,
  List,
  Flex,
  // Button,
  InputItem,
  NavBar,
  Modal,
  Toast,
  WingBlank,
  WhiteSpace,
  Result
} from 'antd-mobile';

import { GiBookshelf } from 'react-icons/gi';
import { IoMdAddCircle, IoIosChatboxes } from 'react-icons/io';

import { errorDialog, successDialog } from '../functions';

const iconSize = 72;

class AccountManager extends Component {
  state = {
    loginScreenOpen: false,
    username: '',
    email: '',
    password: '',
    isLoading: false,
    redirectTo: null,
    splashOver: false
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
      successDialog('Your account is successfully created');
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

  handleSplashFinish = () => {
    this.setState({
      splashOver: true
    });
  };

  render() {
    const { currentUser } = this.props;
    const { loginScreenOpen, redirectTo, splashOver, isLoading } = this.state;

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
      <div>
        <ActivityIndicator toast animating={isLoading} text="Loading..." />

        {/* {!currentUser && (
          <div>
            <div>
              <p style={{ textAlign: 'center' }}>
                <span>Already have an account?</span>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button isSize="small" onClick={() => this.openLoginScreen()}>
                  Login
                </Button>
              </div>
            </div>
          </div>
        )} */}

        <Result
          img={<GiBookshelf size={iconSize} color="orange" />}
          title="Discover & Borrow"
          message="Discover Books, both as an inspiration to read, and to borrow from others. You can borrow a book from your friends, neighbors and other interesting readers in your town. See what
                      books people have"
          buttonText="Discover"
          buttonType="primary"
          onButtonClick={() => this.redirectTo('/discover')}
        />
        <WhiteSpace size="lg" />
        <Result
          img={<IoMdAddCircle size={iconSize} color="purple" />}
          title="Add & Lend"
          message="You can virtualise your book shelf. Let the others see your
                      books by adding some of your books at home to your virtual shelf. So others can see it"
          buttonText="Add a Book"
          buttonType="primary"
          onButtonClick={() => this.redirectTo('/add')}
        />
        <WhiteSpace size="lg" />

        <Result
          img={<IoIosChatboxes size={iconSize} color="green" />}
          title="Chat & Inspire"
          message="For every book lending process, you can chat with others to
                      manage your book lending process. Inspire from amazing readers"
          buttonText="Messages"
          buttonType="primary"
          onButtonClick={() => this.redirectTo('/messages')}
        />
        <WhiteSpace size="lg" />
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
