import React, { Component } from 'react';
import { List, Button, InputItem, Switch, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';

const Item = List.Item;

class CreateAccountUI extends Component {
  state = {
    value: 1
  };
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, error => {
      if (!error) {
        const values = this.props.form.getFieldsValue();
        console.log(values);
        this.props.onSubmit(values);
      } else {
        alert('Validation failed');
      }
    });
  };
  onReset = () => {
    this.props.form.resetFields();
  };
  validateAccount = (rule, value, callback) => {
    if (value && value.length > 4) {
      callback();
    } else {
      callback(new Error('At least four characters for account'));
    }
  };

  render() {
    const { getFieldProps, getFieldError } = this.props.form;

    return (
      <form>
        <List
          renderHeader={() => 'Create a Librella Account'}
          renderFooter={() =>
            getFieldError('account') && getFieldError('account').join(',')
          }
        >
          <InputItem
            {...getFieldProps('username', {
              rules: [
                { required: true, message: 'please enter desired username' },
                { validator: this.validateAccount }
              ]
            })}
            clear
            error={!!getFieldError('username')}
            onErrorClick={() => {
              alert(getFieldError('username').join('、'));
            }}
            placeholder="username"
          >
            Username
          </InputItem>
          <InputItem
            {...getFieldProps('email')}
            placeholder="email address"
            type="email"
          >
            Email
          </InputItem>
          <InputItem
            {...getFieldProps('password')}
            placeholder="password"
            type="password"
          >
            Password
          </InputItem>
          <Item
            extra={
              <Switch
                {...getFieldProps('1', {
                  initialValue: false,
                  valuePropName: 'checked'
                })}
              />
            }
          >
            I accept the terms and the privacy policy
          </Item>

          <Item>
            <Button type="ghost" onClick={this.onSubmit}>
              Create
            </Button>
          </Item>
        </List>
      </form>
    );
  }
}

const CreateAccount = createForm()(CreateAccountUI);

export default CreateAccount;
