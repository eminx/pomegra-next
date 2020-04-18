import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { ActivityIndicator, WhiteSpace, Result } from 'antd-mobile';
import { GiBookshelf } from 'react-icons/gi';
import { IoMdAddCircle, IoIosChatboxes } from 'react-icons/io';
import { FormattedMessage } from 'react-intl';

import { UserContext } from './Layout';

import { errorDialog, successDialog } from '../functions';

const iconSize = 72;

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
        <ActivityIndicator
          toast
          animating={isLoading}
          text="Loading..."
        />

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
          title={<FormattedMessage id="homeWidget1Title" />}
          message={<FormattedMessage id="homeWidget1Message" />}
          buttonText={<FormattedMessage id="homeWidget1ButtonText" />}
          buttonType="primary"
          onButtonClick={() => this.redirectTo('/discover')}
        />
        <WhiteSpace size="lg" />
        <Result
          img={<IoMdAddCircle size={iconSize} color="purple" />}
          title={<FormattedMessage id="homeWidget2Title" />}
          message={<FormattedMessage id="homeWidget2Message" />}
          buttonText={<FormattedMessage id="homeWidget2ButtonText" />}
          buttonType="primary"
          onButtonClick={() => this.redirectTo('/add')}
        />
        <WhiteSpace size="lg" />

        <Result
          img={<IoIosChatboxes size={iconSize} color="green" />}
          title={<FormattedMessage id="homeWidget3Title" />}
          message={<FormattedMessage id="homeWidget1Message" />}
          buttonText={<FormattedMessage id="homeWidget1ButtonText" />}
          buttonType="primary"
          onButtonClick={() => this.redirectTo('/messages')}
        />
        <WhiteSpace size="lg" />
      </div>
    );
  }
}

Home.contextType = UserContext;

export default Home;
