import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Dialog, NavBar, Popup, Skeleton } from 'antd-mobile';
import { Avatar, Box, Center, Flex, Heading } from '@chakra-ui/react';
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

  const handleDelete = async () => {
    try {
      await call('removeBook', id);
      successDialog('Your book is successfully deleted');
      navigate(`/${currentUser?.username}`);
    } catch (error) {
      errorDialog(error);
    }
  };

  if (requestId) {
    navigate(`/request/${requestId}`);
  }

  if (!book || isLoading) {
    return (
      <div>
        <NavBar backArrow={false}>Book Details</NavBar>
        <Center>
          <Skeleton animated style={{ width: '70%', height: '180px', marginBottom: 24 }} />
        </Center>
        <Center>
          <Skeleton animated style={{ width: '90%', height: '40px', marginBottom: 24 }} />
        </Center>
        <Center>
          <Skeleton animated style={{ width: '90%', height: '240px', marginBottom: 24 }} />
        </Center>
      </div>
    );
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

        {isMyBook && (
          <Center mt="2">
            <Button
              color="danger"
              fill="none"
              size="small"
              onClick={() =>
                Dialog.confirm({
                  cancelText: 'Cancel',
                  confirmText: 'Delete',
                  content: 'Are you sure you want to delete this book?',
                  onConfirm: () => {
                    handleDelete();
                  },
                })
              }
            >
              Delete
            </Button>
          </Center>
        )}
      </Box>

      <Popup
        closable
        bodyStyle={{
          height: '98vh',
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
