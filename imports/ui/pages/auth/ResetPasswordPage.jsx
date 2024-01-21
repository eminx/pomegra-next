import React, { useContext, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Box, Center, Heading, Text, useToast } from '@chakra-ui/react';

import { ResetPassword } from './index';
import { call } from '../../../api/_utils/functions';
import AppTabBar from '../../components/AppTabBar';
import { UserContext } from '../../Layout';

function ResetPasswordPage({ history }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { token } = useParams();
  const toast = useToast();

  if (currentUser) {
    return <Navigate to="/my-profile" />;
  }

  if (isSuccess) {
    return <Navigate to="/intro" />;
  }

  const handleResetPassword = async (password) => {
    try {
      await call('resetPassword', token, password);
      toast({
        title: 'Success',
        description: 'Your password is successfully reset. Now you can login',
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      toast({
        description: error.reason,
        status: 'error',
      });
    }
  };

  return (
    <Box>
      <Center p="4">
        <Box>
          <Heading my="4" size="md" textAlign="center">
            Reset Your Password
          </Heading>
          <Text fontSize="lg" mb="8" textAlign="center">
            Type your desired password
          </Text>
          <ResetPassword onResetPassword={handleResetPassword} />
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

export default ResetPasswordPage;
