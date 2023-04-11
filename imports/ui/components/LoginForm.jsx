import React from "react";
import { List, Input, Button } from "antd-mobile";
import { Flex } from "@chakra-ui/react";

const ListItem = List.Item;

const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onButtonClick,
  onSecondaryButtonClick,
  closeLogin,
}) => {
  return (
    <div>
      <List renderHeader={() => "Please enter your credentials"}>
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

      {/* <WhiteSpace size="lg" /> */}

      <Flex justify="center">
        <Button size="small" type="ghost" onClick={closeLogin} inline>
          Back to Signup
        </Button>
      </Flex>
    </div>
  );
};

export default LoginForm;
