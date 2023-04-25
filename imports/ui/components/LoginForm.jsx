import React from 'react';
import { List, Input, Button, NavBar } from 'antd-mobile';
import { Box, Flex } from '@chakra-ui/react';

const ListItem = List.Item;

function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onButtonClick,
  onSecondaryButtonClick,
  closeLogin,
}) {
  return (
    <div>
      <NavBar onBack={closeLogin}>Login to your account</NavBar>
      <Box pb="8">
        <List renderHeader={() => 'Please enter your credentials'}>
          <ListItem>
            <Input
              label="Username or email"
              type="text"
              placeholder="username or email"
              value={username}
              onChange={(value) => onUsernameChange(value)}
            />
          </ListItem>

          <ListItem>
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(value) => onPasswordChange(value)}
            />
          </ListItem>

          <ListItem>
            <Button block color="primary" onClick={onButtonClick}>
              Login
            </Button>
          </ListItem>

          <ListItem>
            <Flex justify="center">
              <Button onClick={onSecondaryButtonClick} inline>
                Forgot Password
              </Button>
            </Flex>
          </ListItem>
        </List>

        <Flex justify="center" py="3">
          <Button size="small" onClick={closeLogin} inline>
            Back to Signup
          </Button>
        </Flex>
      </Box>
    </div>
  );
}

export default LoginForm;
