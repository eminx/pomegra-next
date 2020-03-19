import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Flex,
  Button,
  Card,
  NavBar,
  Icon,
  Toast,
  WingBlank,
  WhiteSpace
} from 'antd-mobile';

import AppTabBar from '../reusables/AppTabBar';
import { errorDialog, successDialog } from '../functions';

class BookDetailTobeRequested extends Component {
  state = {
    requestSuccess: false,
    backToDiscover: false
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
    const { requestSuccess, backToDiscover } = this.state;

    if (requestSuccess) {
      return <Redirect to={`/request/${requestSuccess}`} />;
    }

    if (backToDiscover) {
      return <Redirect to="/discover" />;
    }

    const { book } = this.props;

    if (!book) {
      return null;
    }

    return (
      <div name="books">
        <NavBar
          mode="light"
          leftContent={<Icon type="left" />}
          onLeftClick={() => this.setState({ backToDiscover: true })}
          rightContent={<Icon type="ellipsis" />}
        >
          Details
        </NavBar>

        {book && (
          <Fragment>
            <WhiteSpace size="lg" />
            <WingBlank>
              <Card>
                <Card.Header title={<BookTitle book={book} />} />
                <Card.Body>
                  <p>{book.b_description}</p>
                </Card.Body>
                <Card.Footer
                  content={
                    <Button type="primary" onClick={() => this.makeRequest()}>
                      Borrow
                    </Button>
                  }
                />
              </Card>
            </WingBlank>
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

const BookTitle = ({ book }) => (
  <div style={{ width: '100%' }}>
    <h3 style={{ textAlign: 'center', marginBottom: 0 }}>{book.b_title}</h3>
    <p style={{ textAlign: 'center', marginTop: 8 }}>
      by <em>{book.b_author}</em>
    </p>
    <Flex justify="between" align="start" style={{ paddingTop: 8 }}>
      <img
        src={book.image_url}
        alt={book.image_url}
        style={{ maxHeight: 140, flexGrow: 0 }}
      />
      <div style={{ paddingLeft: 12, paddingRight: 12 }}>
        <div style={{ textAlign: 'right' }}>
          {/* <p style={{ marginTop: 0 }}> */}
          {/* <LightSpan>author</LightSpan> {book.b_author} */}
          {/* </p> */}
          <p style={{ marginTop: 0 }}>
            <LightSpan>category</LightSpan>
            {book.b_cat}
          </p>
          <p style={{ marginTop: 0 }}>
            <LightSpan>language</LightSpan>
            {book.b_lang}
          </p>
        </div>
      </div>
    </Flex>
  </div>
);

const LightSpan = ({ children }) => (
  <span style={{ color: '#888', fontSize: 14 }}>
    <b>{children}</b>
    <br />
  </span>
);
