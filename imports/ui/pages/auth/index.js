import React, { useState } from 'react';
import { Box, Button, Center, Input, Text } from '@chakra-ui/react';

function Notice({ isError, children, ...otherProps }) {
  return (
    <Text
      color={isError ? 'status-error' : 'dark-3'}
      fontSize="sm"
      {...otherProps}
    >
      {children}
    </Text>
  );
}

function SimpleText({ children, ...otherProps }) {
  return (
    <Text textAlign="center" mb="4" fontSize="sm" {...otherProps}>
      {children}
    </Text>
  );
}

function ForgotPassword({ onForgotPassword }) {
  const [email, setEmail] = useState('');

  return (
    <Center>
      <Box mb="4">
        <Input
          bg="white"
          plain
          type="email"
          name="email"
          placeholder=""
          size="lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Center>
          <Button
            colorScheme="green"
            my="4"
            variant="solid"
            onClick={() => onForgotPassword(email)}
          >
            Send reset link
          </Button>
        </Center>
      </Box>
    </Center>
  );
}

function ResetPassword({ onResetPassword }) {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = () => {
    if (password.length < 8) {
      setPasswordError('minimum 8 characters');
    } else {
      console.log(password);
      onResetPassword(password);
    }
  };

  return (
    <Center mb="4">
      <Box>
        <Input
          bg="white"
          type="password"
          name="password"
          placeholder=""
          size="lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Center>
          <Button
            colorScheme="green"
            my="4"
            variant="solid"
            onClick={() => handleSubmit()}
          >
            Reset Password
          </Button>
        </Center>
      </Box>
    </Center>
  );
}

export { ForgotPassword, ResetPassword, SimpleText, Notice };
