import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, List, NavBar, Modal, Toast } from 'antd-mobile';

import AppTabBar from '../reusables/AppTabBar';
import { Redirect } from 'react-router-dom';

// import BookCard from '../../imports/ui/BookCard'

function errorDialog(text) {
  Toast.fail(text, 3);
}

function successDialog(text) {
  Toast.success(text, 3);
}

class BookDetailTobeRequested extends Component {
  state = {
    requestSuccess: false
  };

  makeRequest = () => {
    const { book } = this.props;
    Meteor.call('makeRequest', book._id, (error, respond) => {
      if (error) {
        errorDialog(error.reason);
      } else if (respond.error) {
        errorDialog(respond.error);
      } else {
        successDialog('Your request is successfully sent!');
        console.log(respond);
        this.setState({
          requestSuccess: respond
        });
      }
    });
  };

  render() {
    const { requestSuccess } = this.state;

    if (requestSuccess) {
      return <Redirect to={`/request/${requestSuccess}`} />;
    }

    const { book } = this.props;

    if (!book) {
      return null;
    }

    return (
      <div name="books">
        <NavBar mode="light">{book && book.b_title}</NavBar>

        {book && (
          <Fragment>
            <Card>
              <Card.Header
                title={book.b_author}
                thumb={book.image_url}
                thumbStyle={{ maxHeight: 80 }}
                extra={book.b_cat}
              />
              <Card.Body>{book.b_description}</Card.Body>
              <Card.Footer
                content={
                  <Button onClick={() => this.makeRequest()} type="ghost">
                    Send Request
                  </Button>
                }
              />
            </Card>
            <AppTabBar />
          </Fragment>
        )}
      </div>
    );
  }
}

export default BookDetailTobeRequestedContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const bookId = props.match.params.id;

  const bookSub = Meteor.subscribe('singleBook', bookId);
  const book = Books.findOne(bookId);

  const isLoading = !bookSub.ready();

  return {
    currentUser,
    book,
    isLoading
  };
})(BookDetailTobeRequested);
