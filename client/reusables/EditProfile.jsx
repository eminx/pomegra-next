import React, { Component } from 'react';
import {
  List,
  Button,
  InputItem,
  Tag,
  Picker,
  TextareaItem,
  WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { shallowEqualArrays } from 'shallow-equal';

import allLanguages from '../allLanguages';

const Item = List.Item;

class EditProfileUI extends Component {
  state = {
    languages: []
  };

  componentDidMount() {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }
    this.setState({
      languages: currentUser.languages || []
    });
  }

  handleLanguageSelect = selectedLanguages => {
    const selectedLanguageValue = selectedLanguages[0];
    const { languages } = this.state;

    if (languages.some(language => language.value === selectedLanguageValue)) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      language => language && language.value === selectedLanguageValue
    );

    const newLanguages = [...languages, selectedLanguage];
    this.setState({
      languages: newLanguages
    });

    this.props.isAnyValueChanged();
  };

  handleRemoveLanguage = languageValue => {
    const { languages } = this.state;
    const newLanguages = languages.filter(
      language => languageValue !== language.value
    );
    this.setState({
      languages: newLanguages
    });

    this.props.isAnyValueChanged();
  };

  onSubmit = () => {
    const { languages } = this.state;
    this.props.form.validateFields({ force: true }, error => {
      if (!error) {
        const values = this.props.form.getFieldsValue();
        this.props.onSubmit(values, languages);
      } else {
        alert('Validation failed');
      }
    });
  };

  onReset = () => {
    this.props.form.resetFields();
  };

  validateAccount = (rule, value, callback) => {
    if (value && value.length > 3) {
      callback();
    } else {
      callback(new Error('At least four characters for account'));
    }
  };

  render() {
    const { currentUser, isAnyValueChanged } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const { languages } = this.state;

    return (
      <div>
        <List
          renderHeader={() => 'Edit your details'}
          renderFooter={() =>
            getFieldError('account') && getFieldError('account').join(',')
          }
        >
          <InputItem value={currentUser.username} editable={false}>
            username
          </InputItem>

          <InputItem
            {...getFieldProps('firstName', {
              rules: [
                { required: false, message: 'please enter your first name' }
              ],
              initialValue: currentUser.firstName,
              onChange: isAnyValueChanged
            })}
            clear
            // error={!!getFieldError('firstName')}
            placeholder="first name"
          >
            first name
          </InputItem>

          <InputItem
            {...getFieldProps('lastName', {
              initialValue: currentUser.lastName,
              onChange: isAnyValueChanged
            })}
            clear
            // error={!!getFieldError('lastName')}
            placeholder="last name"
          >
            last name
          </InputItem>

          <TextareaItem
            {...getFieldProps('bio', {
              initialValue: currentUser.bio,
              onChange: isAnyValueChanged
            })}
            title="bio"
            placeholder="bio"
            rows={5}
          />

          <Picker
            {...getFieldProps('language')}
            data={allLanguages}
            cols={1}
            okText="Confirm"
            dismissText="Cancel"
            extra="add language"
            onOk={this.handleLanguageSelect}
          >
            <Item arrow="horizontal">spoken languages</Item>
          </Picker>

          <WhiteSpace />

          <div>
            {languages.map(language => (
              <Tag
                key={language.value}
                style={{ margin: 8 }}
                closable
                onClose={() => this.handleRemoveLanguage(language.value)}
              >
                {language.label}
              </Tag>
            ))}
          </div>

          <Item>
            <Button type="ghost" onClick={this.onSubmit}>
              Save
            </Button>
          </Item>
        </List>
        <WhiteSpace size={30} />
      </div>
    );
  }
}

const EditProfile = createForm()(EditProfileUI);

export default EditProfile;
