import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { NavBar, Popup } from 'antd-mobile';
import { Avatar, Box, Flex, Heading } from '@chakra-ui/react';
import { CloseOutline } from 'antd-mobile-icons';
import queryString from 'query-string';

import { BookCard } from '../components/BookCard';
import EditBook from '../layouts/EditBook';
import { call, errorDialog, successDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';

function Book() {
  const [book, setBook] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    try {
      const respond = await call('getSingleBook', id);
      setBook(respond);
    } catch (error) {
      errorDialog(error.reason || error.error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (formValues, uploadedImage) => {
    setIsLoading(true);
    try {
      const values = {
        ...formValues,
      };
      if (uploadedImage) {
        values.imageUrl = uploadedImage;
      }
      await call('updateBook', book._id, values);
      await getBook();
      successDialog('Your book is successfully updated');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeRequest = async () => {
    if (!currentUser) {
      errorDialog('Please create an account');
    }

    try {
      await call('makeRequest', book._id);
      successDialog('Your request is successfully sent!');
      setRequestId(respond);
    } catch (error) {
      errorDialog(error.reason || error.error);
    }
  };

  const handleBack = () => {
    const { search } = location;
    const { backToUser } = queryString.parse(search, { parseBooleans: true });
    if (backToUser) {
      return navigate(`/${book.ownerUsername}`);
    }
    return navigate('/discover');
  };

  const isMyBook = currentUser?._id === book?.ownerId;

  const handleButtonClick = () => {
    if (isMyBook) {
      setIsEditDialogOpen(true);
    } else {
      makeRequest();
    }
  };

  if (requestId) {
    navigate(`/request/${requestId}`);
  }

  if (!book || isLoading) {
    return null;
    // return <ActivityIndicator toast text="Loading book details..." />;
  }

  if (isLoading || !book) {
    return null;
  }

  return (
    <Box>
      <NavBar
        right={
          <Link to={`/${book.ownerUsername}`}>
            <Avatar name={book.ownerUsername} src={book.ownerImage} size="sm" borderRadius="4px" />
          </Link>
        }
        onBack={handleBack}
      >
        <b>{book.title}</b>
      </NavBar>

      <Box p="4" pt="0">
        <BookCard
          book={book}
          buttonLabel={isMyBook ? 'Edit' : 'Borrow'}
          onButtonClick={handleButtonClick}
        />
      </Box>

      <Popup
        closable
        bodyStyle={{
          height: '93vh',
          overflow: 'scroll',
          padding: 12,
        }}
        position="bottom"
        title="Edit your book"
        visible={currentUser && isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <Flex justify="space-between" p="2">
          <Heading size="md" fontWeight="normal">
            Edit book
          </Heading>
          <CloseOutline fontSize="24px" onClick={() => setIsEditDialogOpen(false)} />
        </Flex>
        <EditBook book={book} updateBook={updateBook} />
      </Popup>
    </Box>
  );
}

export default Book;
