import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, List, NavBar } from 'antd-mobile';

import AppTabBar from '../reusables/AppTabBar';

// import BookCard from '../../imports/ui/BookCard'

const ListItem = List.Item;

class BookDetailTobeRequested extends Component {
  state = {
    requestPopupOpened: false,
    progressOn: false,
    requestSuccess: false
  };

  requestBook = () => {
    const self = this;
    const app = self.$f7;
    const { book } = this.props;
    Meteor.call('makeRequest', book._id, (error, respond) => {
      if (error) {
        app.dialog.alert(`${error.reason}, please try again`, 'Error', () => {
          console.log(error);
        });
      } else if (respond.error) {
        app.dialog.alert(`${respond.error}, please try again`, 'Error', () => {
          console.log(respond);
        });
      } else {
        const notification = app.notification.create({
          icon: '<i class="icon success"></i>',
          title: 'Success!',
          subtitle: 'You have successfully sent your lending request',
          closeButton: true,
          closeTimeout: 6000,
          opened: true
        });
        notification.open();
        self.$f7router.navigate('/request/', {
          props: {
            _id: respond
          }
        });
      }
    });
  };

  render() {
    const { requestPopupOpened, progressOn, requestSuccess } = this.state;
    const { book } = this.props;

    // if (!book) {
    //   return;
    // }

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
              <Card.Footer content={book.b_lang} />
            </Card>
            <Button onClick={() => this.requestBook()}>
              Borrow from owner
            </Button>
            {/* <Popup opened={requestPopupOpened}>
              <Navbar title="Request Handling">
                <NavRight>
                  <Link
                    onClick={() => this.setState({ requestPopupOpened: false })}
                  >
                    Close
                  </Link>
                </NavRight>
              </Navbar>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {progressOn && <Progressbar infinite />}
                {requestSuccess && 'Your request is successfully sent'}
              </div>
            </Popup>{' '} */}
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
