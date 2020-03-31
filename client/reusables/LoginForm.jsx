import React from 'react';
import { List, InputItem, Button, Flex, WhiteSpace } from 'antd-mobile';

const ListItem = List.Item;

const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onButtonClick,
  onSecondaryButtonClick,
  closeLogin
}) => {
  return (
    <div>
      <List renderHeader={() => 'Please enter your credentials'}>
        <ListItem>
          <InputItem
            label="Username or email"
            type="text"
            placeholder="username or email"
            value={username}
            onInput={e => onUsernameChange(e.target.value)}
          />
        </ListItem>

        <ListItem>
          <InputItem
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onInput={e => onPasswordChange(e.target.value)}
          />
        </ListItem>

        <ListItem>
          <Button type="primary" onClick={onButtonClick}>
            Login
          </Button>
        </ListItem>

        <ListItem>
          <Flex justify="center">
            <Button size="small" onClick={onSecondaryButtonClick} inline>
              Forgot Password
            </Button>
          </Flex>
        </ListItem>
      </List>

      <WhiteSpace size="lg" />

      <Flex justify="center">
        <Button size="small" type="ghost" onClick={closeLogin} inline>
          Back to Signup
        </Button>
      </Flex>
    </div>
  );
};

export default LoginForm;
