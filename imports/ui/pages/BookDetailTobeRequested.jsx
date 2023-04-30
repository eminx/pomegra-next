import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, NavBar } from 'antd-mobile';
import { Avatar, Box, Center, Text } from '@chakra-ui/react';
import queryString from 'query-string';

import { BookCard } from '../components/BookCard';
import { errorDialog, successDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';

function BookDetailTobeRequested() {
  const [book, setBook] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
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

  const handleBack = () => {
    const { search } = location;
    const { backToUser } = queryString.parse(search, { parseBooleans: true });
    if (backToUser) {
      return navigate(`/${book.ownerUsername}`);
    }
    return navigate('/discover');
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
      <Center pb="2">
        <Text>owned by: </Text>
        <Link to={`/${book.ownerUsername}`}>
          <Button color="primary" fill="none">
            {book.ownerUsername}
          </Button>
        </Link>
      </Center>
      <Box p="4" pt="0">
        <BookCard book={book} buttonLabel="Borrow" onButtonClick={() => makeRequest()} />
      </Box>
    </>
  );
}

export default BookDetailTobeRequested;
