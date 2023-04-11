import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Link, redirect } from "react-router-dom";
import { Divider, NavBar } from "antd-mobile";
import { Title, Subtitle, Button } from "bloomer";
import { Box, Flex } from "@chakra-ui/react";
import { GiBookshelf } from "react-icons/gi";
import { IoMdAddCircle, IoIosChatboxes } from "react-icons/io";
import { FormattedMessage } from "react-intl";

import { UserContext } from "../Layout";

import { errorDialog, successDialog } from "../../api/_utils/functions";

class Home extends Component {
  state = {
    loginScreenOpen: false,
    username: "",
    email: "",
    password: "",
    isLoading: false,
    redirectTo: null,
    splashOver: false,
  };

  createAccount = (values) => {
    this.setState({ isLoading: true });

    Meteor.call("registerUser", values, (error, respond) => {
      if (error) {
        console.log("error!!");
        console.log(error);
        errorDialog(error.reason);
        this.setState({ isLoading: false });
        return;
      }
      successDialog("Your account is successfully created");
      this.signIn(values);
      this.setState({
        isLoading: false,
        loginScreenOpen: false,
      });
    });
  };

  signIn = (values) => {
    if (values) {
      Meteor.loginWithPassword(values.username, values.password, (error) => {
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

    if (!currentUser) {
      // return redirect("/intro");
    }

    return (
      <div>
        <NavBar mode="light" backArrow={false}>
          Welcome to Librella
        </NavBar>
        <Divider />
        {/* <WhiteSpace size="lg" /> */}
        {/* <ActivityIndicator animating={isLoading} text="Loading..." /> */}

        <HomeWidget
          title="homeWidget1Title"
          message="homeWidget1Message"
          buttonText="homeWidget1ButtonText"
          redirectPath="/discover"
        />

        <HomeWidget
          title="homeWidget2Title"
          message="homeWidget2Message"
          buttonText="homeWidget2ButtonText"
          redirectPath="/add"
        />

        <HomeWidget
          title="homeWidget3Title"
          message="homeWidget3Message"
          buttonText="homeWidget3ButtonText"
          redirectPath="/messages"
        />

        {/* <WhiteSpace size="lg" />
        <WhiteSpace size="lg" /> */}
      </div>
    );
  }
}

function HomeWidget({ title, message, redirectPath, buttonText }) {
  return (
    <Flex flexDirection="column" align="center" mb="12">
      <Title isSize={4}>
        <FormattedMessage id={title} />
      </Title>
      <Box px="4" pb="4">
        <Subtitle isSize={6} hasTextAlign="centered">
          <FormattedMessage id={message} />
        </Subtitle>
      </Box>
      <Link to={redirectPath}>
        <Button
          isColor="light"
          isInverted
          isLink
          className="is-rounded"
          // onClick={() => redirect(redirectPath)}
        >
          <FormattedMessage id={buttonText} />
        </Button>
      </Link>

      <Divider />
    </Flex>
  );
}

Home.contextType = UserContext;

export default Home;
