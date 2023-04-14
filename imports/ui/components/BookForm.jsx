import React, { useState } from 'react';
import { Button, Form, Input, Picker, TextArea } from 'antd-mobile';
import { AddOutline, MinusOutline } from 'antd-mobile-icons';
import { Center } from '@chakra-ui/react';

import allLanguages from '../../api/_utils/langs/allLanguages';
import FilePicker from './FilePicker';

const FormItem = Form.Item;

const authorsKeys = ['elma', 'armut', 'kiraz', 'kayisi', 'seftali'];

function BookForm({ book, uploadableImageLocal, handleSubmit, setUploadableImage }) {
  const [authors, setAuthors] = useState(book.authors ? book.authors.map((item) => item) : ['']);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [language, setLanguage] = useState(book.language);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleNewAuthor = () => {
    const newAuthors = [...authors];
    newAuthors.push('');
    setAuthors(newAuthors);
  };

  const handleRemoveAuthor = (index) => {
    const newAuthors = [...authors];
    newAuthors.splice(index, 1);
    setAuthors(newAuthors);
  };

  const handleFormSubmit = () => {
    setIsSaving(true);
    const values = form.getFieldsValue();
    const valuesArray = Object.keys(values);
    const authorsArray = valuesArray
      .filter((key) => key.substring(0, 6) === 'author')
      .map((key) => {
        return values[key];
      });

    const parsedValues = {
      title: values.title,
      titleLowerCase: values.title.toLowerCase(),
      authors: authorsArray,
      authorsLowerCase: authorsArray.map((a) => a.toLowerCase()),
      category: values.category,
      categoryLowerCase: values.category.toLowerCase(),
      language: language,
      ISBN: values.ISBN,
      publisher: values.publisher,
      publishedDate: values.publishedDate,
      description: values.description,
    };

    handleSubmit(parsedValues);
  };

  const selectedLang = allLanguages.find((l) => {
    return l.value === (language || book.language);
  });

  book.authors?.forEach((a, i) => {
    book[`author${i + 1}`] = book.authors[i];
  });

  book.ISBN = book.industryIdentifiers && book.industryIdentifiers[1]?.identifier;

  return (
    <Form
      form={form}
      initialValues={book}
      layout="horizontal"
      requiredMarkStyle="asterisk"
      footer={
        <Button block color="primary" loading={isSaving} type="submit" onClick={handleFormSubmit}>
          Submit
        </Button>
      }
    >
      <Form.Header>Fill in the fields and confirm</Form.Header>
      <FormItem
        name="title"
        label="Title"
        rules={[{ required: true, message: 'First name is required' }]}
      >
        <Input />
      </FormItem>

      {authors?.map((item, index) => (
        <FormItem
          key={authorsKeys[index]}
          label={`Author (${index + 1})`}
          name={`author${index + 1}`}
          rules={[
            {
              required: index === 0,
              message: 'One Author is required',
            },
          ]}
          extra={
            index === 0 ? (
              <AddOutline onClick={handleNewAuthor} />
            ) : (
              <MinusOutline onClick={() => handleRemoveAuthor(index)} />
            )
          }
        >
          <Input type="text" />
        </FormItem>
      ))}

      <FormItem
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Category is required' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="Language"
        rules={[{ required: true, message: 'Language is required' }]}
        onClick={() => setPickerVisible(true)}
      >
        <Input value={selectedLang?.label} readOnly />
      </FormItem>
      <Picker
        cancelText="Cancel"
        columns={[allLanguages]}
        confirmText="Confirm"
        mouseWheel
        title="Language"
        value={selectedLang?.label}
        visible={pickerVisible}
        onConfirm={(value) => setLanguage(value[0])}
        onClose={() => setPickerVisible(false)}
      />

      <FormItem name="ISBN" label="ISBN" rules={[{ required: false }]}>
        <Input pattern="[0-9]*" />
      </FormItem>

      <FormItem name="publisher" label="Publisher" rules={[{ required: false }]}>
        <Input />
      </FormItem>

      <FormItem name="publishedDate" label="Publication date" rules={[{ required: false }]}>
        <Input placeholder="YYYY or YYYY-MM-DD" />
      </FormItem>

      <FormItem name="description" label="Description" rules={[{ required: false }]}>
        <TextArea rows={5} />
      </FormItem>

      <FormItem label="Image">
        <Center>
          <FilePicker
            imageUrl={book.imageUrl}
            height="120px"
            uploadableImageLocal={uploadableImageLocal}
            setUploadableImage={setUploadableImage}
          />
        </Center>
      </FormItem>
    </Form>
  );
}

export default BookForm;
