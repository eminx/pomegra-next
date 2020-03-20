import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { NavBar, Icon, WingBlank, WhiteSpace } from 'antd-mobile';

import { BookCard } from '../reusables/BookCard';
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
      <div>
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
              <BookCard
                book={book}
                onButtonClick={() => this.makeRequest()}
                buttonType="primary"
                buttonText="Ask to Borrow"
              />
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
