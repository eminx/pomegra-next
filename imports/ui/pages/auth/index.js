import React, { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Text,
  TextInput,
} from 'grommet';

function Notice({ isError, children, ...otherProps }) {
  return (
    <Text
      color={isError ? 'status-error' : 'dark-3'}
      size="small"
      {...otherProps}
    >
      {children}
    </Text>
  );
}

function SimpleText({ children, ...otherProps }) {
  return (
    <Text
      textAlign="center"
      margin={{ bottom: 'medium' }}
      size="small"
      {...otherProps}
    >
      {children}
    </Text>
  );
}

function ForgotPassword({ onForgotPassword }) {
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => onForgotPassword(value)}>
        <FormField
          label="Type your email please"
          margin={{ bottom: 'medium', top: 'medium' }}
        >
          <TextInput plain type="email" name="email" placeholder="" />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Send reset link" />
        </Box>
      </Form>
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
    <Box margin={{ bottom: 'medium' }}>
      <Form onSubmit={({ value }) => handleSubmit(value)}>
        <FormField
          label="Password"
          margin={{ bottom: 'medium', top: 'medium' }}
          help={<Notice>minimum 8 characters</Notice>}
          error={<Notice isError>{passwordError}</Notice>}
        >
          <TextInput type="password" name="password" placeholder="" />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button type="submit" primary label="Reset Password" />
        </Box>
      </Form>
    </Box>
  );
}

export { ForgotPassword, ResetPassword, SimpleText, Notice };
