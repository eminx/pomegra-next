import React, { useState } from 'react';
import { Box, Button, Center, Input, Text } from '@chakra-ui/react';

function Notice({ isError, children, ...otherProps }) {
  return (
    <Text color={isError ? 'status-error' : 'dark-3'} fontSize="sm" {...otherProps}>
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
  return (
    <Box mb="4">
      <form onSubmit={({ value }) => onForgotPassword(value)}>
        <Input plain type="email" name="email" placeholder="" />
        <Center>
          <Button type="submit">Send reset link</Button>
        </Center>
      </form>
    </Box>
  );
}

function ResetPassword({ onResetPassword }) {
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = (value) => {
    const { password } = value;
    if (password.length < 8) {
      setPasswordError('minimum 8 characters');
    } else {
      onResetPassword(password);
    }
  };

  return (
    <Box mb="4">
      <form onSubmit={({ value }) => handleSubmit(value)}>
        {/* <FormField
          label="Password"
          margin={{ bottom: 'medium', top: 'medium' }}
          help={<Notice>minimum 8 characters</Notice>}
          error={<Notice isError>{passwordError}</Notice>}
        > */}
        <TextInput type="password" name="password" placeholder="" />
        {/* </FormField> */}

        <Center>
          <Button type="submit">Reset Password</Button>
        </Center>
      </form>
    </Box>
  );
}

export { ForgotPassword, ResetPassword, SimpleText, Notice };
