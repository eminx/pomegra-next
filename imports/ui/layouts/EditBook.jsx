import React, { useState } from 'react';

import BookForm from '../components/BookForm';
import { resizeImage, uploadImage } from '../../api/_utils/functions';
import { errorDialog } from '../components/Toast';

const imageModel = {
  uploadableImage: null,
  uploadableImageLocal: null,
};

function EditBook({ book, updateBook }) {
  const [image, setImage] = useState(imageModel);

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error('Please select only one file');
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setImage({
          uploadableImage,
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  const handleUploadImage = async (values) => {
    const { uploadableImage } = image;
    try {
      const resizedImage = await resizeImage(uploadableImage, 180);
      const uploadedImage = await uploadImage(resizedImage, 'bookImageUpload');
      updateBook(values, uploadedImage);
    } catch (error) {
      console.log('Error uploading:', error);
      errorDialog(error.reason);
    }
  };

  const handleSubmit = (values) => {
    if (image.uploadableImage) {
      handleUploadImage(values);
    } else {
      updateBook(values);
    }
  };

  return (
    <BookForm
      book={book}
      uploadableImageLocal={image?.uploadableImageLocal}
      handleSubmit={handleSubmit}
      setUploadableImage={setUploadableImage}
    />
  );
}

export default EditBook;
