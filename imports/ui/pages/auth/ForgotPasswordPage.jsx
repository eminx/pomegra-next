import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router';
import { Toast } from 'antd-mobile';
import { Box, Heading, Text } from '@chakra-ui/react';

import { ForgotPassword, SimpleText } from './index';
import { call } from '../../../api/_utils/functions';
import AppTabBar from '../../components/AppTabBar';
import { UserContext } from '../../Layout';
import Anchor from '../../components/Anchor';

function ForgotPasswordPage({ history }) {
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser } = useContext(UserContext);

  if (currentUser) {
    return <Navigate to="/my-profile" />;
  }

  const handleForgotPassword = async (email) => {
    try {
      await call('forgotPassword', email);
      Toast.success(
        'Please check your email and see if you received a link to reset your password'
      );
      setEmailSent(true);
    } catch (error) {
      Toast.fail(error.reason);
    }
  };

  return (
    <Box w="100%" px="4" py="2">
      <Box w="md" alignSelf="center">
        <Heading size="md">Forgot Password</Heading>
        <Text fontSize="lg" mb="4">
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
