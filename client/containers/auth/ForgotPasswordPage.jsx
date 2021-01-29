import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Anchor, Box, Heading, Text } from 'grommet';
import { message } from 'antd-mobile';

import { ForgotPassword, SimpleText } from './index';
import { call } from '../../functions';

function ForgotPasswordPage({ history }) {
  const [emailSent, setEmailSent] = useState(false);
  const currentUser = Meteor.user();

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  const handleForgotPassword = async (email) => {
    try {
      await call('forgotPassword', email);
      message.success(
        'Please check your email and see if you received a link to reset your password',
      );
      setEmailSent(true);
    } catch (error) {
      message.error(error.reason);
    }
  };

  return (
    <Box width="100%">
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Forgot Password</Heading>
        <Text size="large" margin={{ bottom: 'medium' }}>
          Reset your password via a link sent to your email
        </Text>
        {emailSent ? (
          <Text>Reset link is sent to your email.</Text>
        ) : (
          <ForgotPassword onForgotPassword={handleForgotPassword} />
        )}
        <Box
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
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPasswordPage;
