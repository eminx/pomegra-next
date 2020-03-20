import React, { Component } from 'react';
import { List, Button, InputItem, Picker, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';

import allLanguages from '../allLanguages';

const Item = List.Item;

class EditBookUI extends Component {
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, error => {
      if (!error) {
        const values = this.props.form.getFieldsValue();
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
    if (value && value.length > 3) {
      callback();
    } else {
      callback(new Error('At least four characters for account'));
    }
  };

  render() {
    const { book } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;

    return (
      <form>
        <List
          renderHeader={() => 'Edit details of your book'}
          renderFooter={() =>
            getFieldError('account') && getFieldError('account').join(',')
          }
        >
          <InputItem
            {...getFieldProps('title', {
              rules: [
                { required: true, message: 'please enter the book title' },
                { validator: this.validateAccount }
              ],
              initialValue: book ? book.b_title : null
            })}
            clear
            error={!!getFieldError('title')}
            onErrorClick={() => {
              alert(getFieldError('title').join('、'));
            }}
            placeholder="title"
          >
            title
          </InputItem>

          <InputItem
            {...getFieldProps('author', {
              rules: [
                { required: true, message: 'please enter the book title' },
                { validator: this.validateAccount }
              ],
              initialValue: book ? book.b_author : null
            })}
            clear
            error={!!getFieldError('author')}
            placeholder="author"
          >
            author
          </InputItem>

          <InputItem
            {...getFieldProps('isbn', {
              initialValue: book && book.b_ISBN && book.b_ISBN.identifier
            })}
            clear
            error={!!getFieldError('isbn')}
            placeholder="isbn or other id"
          >
            ISBN
          </InputItem>

          <Picker
            {...getFieldProps('language')}
            data={allLanguages}
            cols={1}
            okText="Confirm"
            dismissText="Cancel"
            extra={book.b_lang}
          >
            <Item arrow="horizontal">language</Item>
          </Picker>

          <TextareaItem
            {...getFieldProps('description', {
              initialValue: book && book.b_description
            })}
            title="description"
            placeholder="description"
            // autoHeight
            rows={5}
          />

          <Item>
            <Button type="ghost" onClick={this.onSubmit}>
              Save
            </Button>
          </Item>
        </List>
      </form>
    );
  }
}

const EditBook = createForm()(EditBookUI);

export default EditBook;
