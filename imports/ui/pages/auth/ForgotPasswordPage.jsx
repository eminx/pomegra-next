import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { Anchor, Box, Heading, Text } from "grommet";
import { Toast } from "antd-mobile";

import { ForgotPassword, SimpleText } from "./index";
import { call } from "../../../api/_utils/functions";
import AppTabBar from "../../components/AppTabBar";
import { UserContext } from "../../Layout";

function ForgotPasswordPage({ history }) {
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser } = useContext(UserContext);

  if (currentUser) {
    return <Navigate to="/my-profile" />;
  }

  const handleForgotPassword = async (email) => {
    try {
      await call("forgotPassword", email);
      Toast.success(
        "Please check your email and see if you received a link to reset your password"
      );
      setEmailSent(true);
    } catch (error) {
      Toast.fail(error.reason);
    }
  };

  return (
    <Box width="100%" pad={{ vertical: "large", horizontal: "small" }}>
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Forgot Password</Heading>
        <Text size="large" margin={{ bottom: "medium" }}>
          Reset your password via a link sent to your email
        </Text>
        {emailSent ? (
          <Text>Reset link is sent to your email.</Text>
        ) : (
          <ForgotPassword onForgotPassword={handleForgotPassword} />
        )}
        {/* <Box
          direction="row"
          justify="around"
          margin={{ top: 'small', left: 'large', right: 'large' }}
        >
          <SimpleText>
            <Anchor onClick={() => history.push('/login')}>
              Login
            </Anchor>
          </SimpleText>
          <SimpleText>
            <Anchor onClick={() => history.push('/signup')}>
              Signup
            </Anchor>
          </SimpleText>
        </Box> */}
      </Box>

      <AppTabBar />
    </Box>
  );
}

export default ForgotPasswordPage;
