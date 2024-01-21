import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Center, Heading, Text, useToast } from '@chakra-ui/react';

import { ForgotPassword } from './index';
import { call } from '../../../api/_utils/functions';
import AppTabBar from '../../components/AppTabBar';
import { UserContext } from '../../Layout';

function ForgotPasswordPage({ history }) {
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser } = useContext(UserContext);
  const toast = useToast();

  if (currentUser) {
    return <Navigate to={`/${currentUser.username}`} />;
  }

  const handleForgotPassword = async (email) => {
    try {
      await call('resetUserPassword', email);
      toast({
        title: 'Email sent',
        description:
          'Please check your email and see if you received a link to reset your password',
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      setEmailSent(true);
    } catch (error) {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Center p="4">
        <Box alignSelf="center">
          <Heading size="md" my="4" textAlign="center">
            Forgot Password
          </Heading>
          <Text fontSize="lg" mb="8" textAlign="center">
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
      </Center>

      <AppTabBar />
    </Box>
  );
}

export default ForgotPasswordPage;
