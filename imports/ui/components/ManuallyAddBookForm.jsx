import React, { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Icon,
  ImageUploader,
  Input,
  Picker,
  TextArea,
} from "antd-mobile";
import { Flex } from "@chakra-ui/react";

import allLanguages from "../../api/_utils/langs/allLanguages";

const linkStyle = { color: "#108ee9", cursor: "pointer" };

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
  const [pickerVisible, setPickerVisible] = useState(false);

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
    <>
      <Form
        layout="horizontal"
        footer={
          <Button
            block
            color="primary"
            loading={isSaving}
            size="large"
            type="submit"
            onSubmit={onSave}
          >
            Submit
          </Button>
        }
      >
        <Form.Header>Add a Book Manually</Form.Header>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input
            name="title"
            type="text"
            placeholder="The Trial"
            value={values.title}
            onChange={(value) => onFormChange("title", value)}
          />
        </Form.Item>

        <Form.Item
          name="authors"
          label="Authors"
          rules={[{ required: true, message: "Authors required" }]}
        >
          {authors &&
            authors.map((nr, index) => (
              <Input
                key={nr + index.toString()}
                label="Author"
                name={`author${nr}`}
                type="text"
                placeholder="Franz Kafka"
                value={values[`author${nr}`]}
                onChange={(value) => onFormChange(`author${nr}`, value, index)}
                extra={
                  nr === authors.length.toString() ? (
                    values[`author${nr}`] === "" && nr !== "1" ? (
                      <RemoveAuthor />
                    ) : (
                      <AddAuthor />
                    )
                  ) : null
                }
              />
              // >{`author (${nr})`}</Input>
            ))}
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Input
            label="Category"
            name="category"
            type="text"
            placeholder="Fiction"
            value={values.category}
            onChange={(value) => onFormChange("category", value)}
          />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true, message: "Language is required" }]}
          onClick={() => setPickerVisible(true)}
        >
          <Picker
            columns={[allLanguages]}
            confirmText="Confirm"
            cancelText="Cancel"
            visible={pickerVisible}
            title="Language"
            value={values.language}
            onConfirm={(value) => onFormChange("language", value)}
            onClose={() => setPickerVisible(false)}
          />
        </Form.Item>

        <Form.Item name="isbn" label="ISBN" rules={[{ required: false }]}>
          <Input
            label="ISBN"
            name="isbn"
            type="text"
            pattern="[0-9]*"
            placeholder="ISBN"
            value={values.ISBN}
            onChange={(value) => onFormChange("ISBN", value)}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: false }]}
        >
          <TextArea
            label="Description"
            name="description"
            placeholder="description"
            rows={5}
            title="description"
            value={values.description}
            onChange={(value) => onFormChange("description", value)}
          />
        </Form.Item>

        <Form.Item>
          <ImageUploader
            value={bookImage ? [bookImage] : []}
            onChange={onImagePick}
            selectable={!bookImage}
            accept="image/jpeg,image/jpg,image/png"
            multiple={false}
            length={1}
            style={{
              width: 120,
            }}
          />
        </Form.Item>
      </Form>

      <Divider />

      <Flex justify="center">
        <Button size="small" type="ghost" inline onClick={onClose}>
          Back
        </Button>
      </Flex>
    </>
  );
};

export default ManuallyAddBookForm;
