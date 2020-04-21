import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  ActivityIndicator,
  WhiteSpace,
  NavBar,
  WingBlank,
  Flex,
} from 'antd-mobile';
import { Title, Subtitle, Button } from 'bloomer';
import { GiBookshelf } from 'react-icons/gi';
import { IoMdAddCircle, IoIosChatboxes } from 'react-icons/io';
import { FormattedMessage } from 'react-intl';

import { UserContext } from './Layout';

import { errorDialog, successDialog } from '../functions';

class Home extends Component {
  state = {
    loginScreenOpen: false,
    username: '',
    email: '',
    password: '',
    isLoading: false,
    redirectTo: null,
    splashOver: false,
  };

  createAccount = (values) => {
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
        loginScreenOpen: false,
      });
    });
  };

  signIn = (values) => {
    console.log(values);
    if (values) {
      Meteor.loginWithPassword(
        values.username,
        values.password,
        (error) => {
          if (error) {
            errorDialog(error);
            console.log(error);
          }
        },
      );
    } else {
      const { username, password } = this.state;
      if (!username || !password) {
        return;
      }

      Meteor.loginWithPassword(username, password, (error) => {
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
      loginScreenOpen: true,
    });
  };

  closeScreen = () => {
    this.setState({
      loginScreenOpen: false,
    });
  };

  redirectTo = (route) => {
    this.setState({
      redirectTo: route,
    });
  };

  handleSplashFinish = () => {
    this.setState({
      splashOver: true,
    });
  };

  render() {
    const { currentUser, userLoading } = this.context;
    const { redirectTo, isLoading } = this.state;

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
      <div>
        <NavBar mode="light">Welcome to Librella</NavBar>
        <WhiteSpace size="lg" />
        <ActivityIndicator animating={isLoading} text="Loading..." />

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

        <HomeWidget
          title="homeWidget1Title"
          message="homeWidget1Message"
          buttonText="homeWidget1ButtonText"
          redirectPath="/discover"
          redirectTo={this.redirectTo}
        />

        <HomeWidget
          title="homeWidget2Title"
          message="homeWidget2Message"
          buttonText="homeWidget2ButtonText"
          redirectPath="/add"
          redirectTo={this.redirectTo}
        />

        <HomeWidget
          title="homeWidget3Title"
          message="homeWidget3Message"
          buttonText="homeWidget3ButtonText"
          redirectPath="/messages"
          redirectTo={this.redirectTo}
        />

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
      </div>
    );
  }
}

function HomeWidget({
  title,
  message,
  redirectPath,
  buttonText,
  redirectTo,
}) {
  return (
    <div
      style={{
        borderBottom: '1px solid #eee',
        paddingBottom: 24,
        marginBottom: 12,
        backgroundColor: '#fff',
      }}
    >
      <WingBlank>
        <Flex
          justify="center"
          style={{ paddingTop: 4 }}
          direction="column"
        >
          <Title isSize={4}>
            <FormattedMessage id={title} />
          </Title>
          <Subtitle isSize={6} hasTextAlign="centered">
            <FormattedMessage id={message} />
          </Subtitle>
          <Button
            isColor="light"
            isInverted
            // isOutlined
            isLink
            className="is-rounded"
            onClick={() => redirectTo(redirectPath)}
          >
            <FormattedMessage id={buttonText} />
          </Button>
        </Flex>
      </WingBlank>
    </div>
  );
}

Home.contextType = UserContext;

export default Home;
