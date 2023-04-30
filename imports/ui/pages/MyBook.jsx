import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, NavBar, Popup } from 'antd-mobile';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { CloseOutline } from 'antd-mobile-icons';

import { BookCard } from '../components/BookCard';
import EditBook from '../layouts/EditBook';
import { call, errorDialog, successDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';

function MyBook() {
  const [book, setBook] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    try {
      const respond = await call('getMyBook', id);
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

  if (isLoading || !book) {
    return null;
  }

  return (
    <Box>
      <NavBar onBack={() => navigate('/my-shelf')}>
        <b>{book.title}</b>
      </NavBar>

      <Box p="4" pt="0">
        <BookCard book={book} />
      </Box>

      <Box px="4">
        <Button color="primary" block onClick={() => setIsEditDialogOpen(true)}>
          Edit
        </Button>
      </Box>

      <Popup
        closable
        bodyStyle={{
          minHeight: '100vh',
          maxHeight: '100vh',
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

export default MyBook;
