import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, NavBar, Popup, SearchBar, Skeleton } from 'antd-mobile';
import { FadeInUp } from 'animate-components';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { CloseOutline } from 'antd-mobile-icons';

import { UserContext } from '../Layout';
import {
  errorDialog,
  resizeImage,
  successDialog,
  uploadImage,
  call,
} from '../../api/_utils/functions';
import BookCardNext from '../components/BookCardNext';
import AppTabBar from '../components/AppTabBar';
import BookForm from '../components/BookForm';

const googleApi = 'https://www.googleapis.com/books/v1/volumes?q=';

const bookModel = {
  title: '',
  author1: '',
  category: '',
  language: '',
  ISBN: '',
  publisher: '',
  publishedDate: '',
  description: '',
};

const imageModel = {
  uploadableImage: null,
  uploadableImageLocal: null,
};

function AddBook() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchbarInput, setSearchbarInput] = useState('');
  const [image, setImage] = useState(imageModel);
  const [openBook, setOpenBook] = useState(null);
  const [isManuallyAddModalOpen, setIsManuallyAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const searchbarSearch = () => {
    setIsLoading(true);
    fetch(googleApi + searchbarInput)
      .then((results) => {
        return results.json();
      })
      .then((parsedResults) => {
        setSearchResults(parsedResults.items);
        setIsLoading(false);
      });
  };

  const handleToggleBook = (index) => {
    if (openBook === index) {
      setOpenBook(null);
      return;
    }
    setOpenBook(index);
  };

  const insertBook = async (book) => {
    if (alreadyOwnsBook(book)) {
      errorDialog('You already own this book');
      return;
    }

    try {
      await call('insertBook', book);
      successDialog('Book is successfully added to your virtual shelf');
      setOpenBook(null);
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    }
  };

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
      insertBookManually(values, uploadedImage);
    } catch (error) {
      console.log('Error uploading:', error);
      errorDialog(error.reason);
    }
  };

  const insertBookManually = async (formValues, uploadedImage) => {
    try {
      const values = {
        ...formValues,
      };
      if (uploadedImage) {
        values.imageUrl = uploadedImage;
      }
      await call('insertBookManually', values);
      successDialog('Your book is successfully added');
      setIsManuallyAddModalOpen(false);
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    } finally {
    }
  };

  const handleSubmit = (values) => {
    if (image.uploadableImage) {
      handleUploadImage(values);
    } else {
      insertBookManually(values);
    }
  };

  const alreadyOwnsBook = (book) => {
    return false;
    // return Books.findOne({
    //   title: book.title,
    //   ownerId: currentUser._id,
    // });
  };

  return (
    <div>
      <NavBar onBack={() => navigate('/')}>Add book to your shelf</NavBar>

      <Box p="4">
        <SearchBar
          cancelText="Cancel"
          placeholder="title, author, ISBN etc"
          style={{ '--height': '42px', '--background': '#fff' }}
          value={searchbarInput}
          onChange={(value) => setSearchbarInput(value)}
          onClear={() => setSearchResults([])}
          onSearch={() => searchbarSearch()}
        />
      </Box>

      {isLoading && (
        <div>
          <Skeleton animated style={{ width: '100%', height: '180px', marginBottom: 24 }} />
          <Skeleton animated style={{ width: '100%', height: '180px', marginBottom: 24 }} />
          <Skeleton animated style={{ width: '100%', height: '180px', marginBottom: 24 }} />
          <Skeleton animated style={{ width: '100%', height: '180px', marginBottom: 24 }} />
        </div>
      )}

      <div style={{ paddingTop: 24 }}>
        {searchResults &&
          searchResults.map((result, index) => (
            <FadeInUp key={result.id} duration=".5s" timingFunction="ease">
              <BookCardNext
                isDark
                volumeInfo={result.volumeInfo}
                onClickBook={() => handleToggleBook(index)}
                isOpen={openBook === index}
                buttonText="Add to My Shelf"
                onButtonClick={() => insertBook(result.volumeInfo)}
              />
            </FadeInUp>
          ))}
      </div>

      {!isLoading && (
        <Flex justify="center">
          <Button onClick={() => setIsManuallyAddModalOpen(true)}>Manually Add Book</Button>
        </Flex>
      )}

      <Popup
        closable
        bodyStyle={{
          height: '93vh',
          overflow: 'scroll',
          padding: 12,
        }}
        position="bottom"
        title="Manually Add Book"
        visible={isManuallyAddModalOpen}
        onClose={() => setIsManuallyAddModalOpen(false)}
      >
        <Flex justify="space-between" mb="4">
          <Heading size="md" fontWeight="normal">
            Manually add a book
          </Heading>
          <CloseOutline fontSize="24px" onClick={() => setIsManuallyAddModalOpen(false)} />
        </Flex>

        <BookForm
          book={bookModel}
          uploadableImageLocal={image?.uploadableImageLocal}
          handleSubmit={handleSubmit}
          setUploadableImage={setUploadableImage}
        />
      </Popup>

      <AppTabBar />
    </div>
  );
}

export default AddBook;
