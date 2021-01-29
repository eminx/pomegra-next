import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Anchor, Box, Heading, Text } from 'grommet';
import { Toast } from 'antd-mobile';

import { ResetPassword, SimpleText } from './index';
import { call } from '../../functions';

function ResetPasswordPage({ history, match }) {
  const currentUser = Meteor.user();
  const { token } = match.params;

  if (currentUser) {
    return <Redirect to="/my-profile" />;
  }

  const handleResetPassword = async (password) => {
    try {
      await call('resetPassword', token, password);
      Toast.success(
        'Your password is successfully reset. Now you can login',
      );
      history.push('/login');
    } catch (error) {
      Toast.fail(error.reason);
    }
  };

  return (
    <Box width="100%">
      <Box width="medium" alignSelf="center">
        <Heading level={2}>Reset Your Password</Heading>
        <Text size="large" margin={{ bottom: 'medium' }}>
          Type your desired password
        </Text>
        <ResetPassword onResetPassword={handleResetPassword} />
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

export default ResetPasswordPage;
