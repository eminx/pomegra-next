import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, NavBar } from 'antd-mobile';

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
      if (error) {
        console.log(error);
        errorDialog(error.reason);
      } else if (respond.error) {
        console.log(error);
        errorDialog(respond.error);
      } else {
        successDialog('Your request is successfully sent!');
        setRequestSuccess(respond);
      }
    });
  };

  if (requestSuccess) {
    return redirect(`/request/${requestSuccess}`);
  }

  if (!book || isLoading) {
    return null;
    // return <ActivityIndicator toast text="Loading book details..." />;
  }

  return (
    <>
      <NavBar
        mode="light"
        onBack={() => navigate('/discover')}
        rightContent={<Icon type="ellipsis" />}
      >
        Details
      </NavBar>

      <Box px="2">
        <BookCard book={book} />
      </Box>

      <Box px="4">
        <Button color="primary" block onClick={() => makeRequest()}>
          Ask to Borrow
        </Button>
      </Box>
    </>
  );
}

export default BookDetailTobeRequested;
