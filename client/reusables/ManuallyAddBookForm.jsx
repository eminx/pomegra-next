import React from 'react';
import {
  Button,
  Flex,
  Icon,
  ImagePicker,
  InputItem,
  List,
  Picker,
  TextareaItem,
  WhiteSpace,
} from 'antd-mobile';

const ListItem = List.Item;

import allLanguages from '../allLanguages';

const linkStyle = { color: '#108ee9', cursor: 'pointer' };

const ManuallyAddBookForm = ({
  values,
  bookImage,
  isSaving,
  onImagePick,
  onFormChange,
  onAddAuthor,
  onRemoveAuthor,
  onSave,
  onClose,
}) => {
  let authors = [];
  for (let i = 1; i <= values.numberOfAuthors; i++) {
    authors.push(i.toString());
  }

  const AddAuthor = () => (
    <a style={linkStyle}>
      <Icon type="plus" onClick={onAddAuthor} />
    </a>
  );

  const RemoveAuthor = () => (
    <a style={linkStyle}>
      <Icon size="sm" type="minus" onClick={onRemoveAuthor} />
    </a>
  );

  return (
    <div>
      <Flex justify="center">
        <ImagePicker
          files={bookImage ? [bookImage] : []}
          onChange={onImagePick}
          selectable={!bookImage}
          accept="image/jpeg,image/jpg,image/png"
          multiple={false}
          length={1}
          style={{
            width: 120,
          }}
        />
      </Flex>
      <List
        renderHeader={() => 'Please enter the details of your book'}
      >
        <InputItem
          name="title"
          type="text"
          placeholder="The Trial"
          value={values.title}
          onInput={(e) => onFormChange('title', e.target.value)}
        >
          title
        </InputItem>

        {authors &&
          authors.map((nr, index) => (
            <InputItem
              key={nr + index.toString()}
              label="Author"
              name={`author${nr}`}
              type="text"
              placeholder="Franz Kafka"
              value={values[`author${nr}`]}
              onInput={(e) =>
                onFormChange(`author${nr}`, e.target.value, index)
              }
              extra={
                nr === authors.length.toString() ? (
                  values[`author${nr}`] === '' && nr !== '1' ? (
                    <RemoveAuthor />
                  ) : (
                    <AddAuthor />
                  )
                ) : null
              }
            >{`author (${nr})`}</InputItem>
          ))}

        <InputItem
          label="Category"
          name="category"
          type="text"
          placeholder="Fiction"
          value={values.category}
          onInput={(e) => onFormChange('category', e.target.value)}
        >
          category
        </InputItem>

        <Picker
          title="Language"
          extra="select"
          data={allLanguages}
          cols={1}
          okText="Confirm"
          dismissText="Cancel"
          value={values.language}
          onOk={(value) => onFormChange('language', value)}
        >
          <InputItem>language</InputItem>
        </Picker>

        <InputItem
          label="ISBN"
          name="isbn"
          type="text"
          pattern="[0-9]*"
          placeholder="ISBN"
          value={values.ISBN}
          onInput={(e) => onFormChange('ISBN', e.target.value)}
        >
          ISBN
        </InputItem>

        <TextareaItem
          label="Description"
          name="description"
          placeholder="description"
          rows={5}
          title="description"
          value={values.description}
          onChange={(value) => onFormChange('description', value)}
        />

        <ListItem>
          <Button type="primary" onClick={onSave} loading={isSaving}>
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </ListItem>
      </List>

      <WhiteSpace size="lg" />

      <Flex justify="center">
        <Button size="small" type="ghost" inline onClick={onClose}>
          Back
        </Button>
      </Flex>
    </div>
  );
};

export default ManuallyAddBookForm;
