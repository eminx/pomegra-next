import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Icon, NavBar } from 'antd-mobile';
import { Box } from '@chakra-ui/react';

import { BookCard } from '../components/BookCard';
import { errorDialog, successDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';

function BookDetailTobeRequested() {
  const [book, setBook] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.call('getSingleBook', id, (error, respond) => {
      setBook(respond);
      setIsLoading(false);
    });
  }, []);

  const makeRequest = () => {
    if (!currentUser) {
      errorDialog('Please create an account');
    }

    Meteor.call('makeRequest', book._id, (error, respond) => {
      if (error || respond.error) {
        console.log(error);
        errorDialog(error.reason || error.error);
        return;
      }
      successDialog('Your request is successfully sent!');
      setRequestSuccess(respond);
    });
  };

  if (requestSuccess) {
    return navigate(`/request/${requestSuccess}`);
  }

  if (!book || isLoading) {
    return null;
    // return <ActivityIndicator toast text="Loading book details..." />;
  }

  return (
    <>
      <NavBar onBack={() => navigate('/discover')}>
        <b>{book.title}</b>
      </NavBar>

      <Box p="4" pt="0">
        <BookCard book={book} />
      </Box>

      <Box px="4" mb="8">
        <Button color="primary" block onClick={() => makeRequest()}>
          Ask to Borrow
        </Button>
      </Box>
    </>
  );
}

export default BookDetailTobeRequested;
