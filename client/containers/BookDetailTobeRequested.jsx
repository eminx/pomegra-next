import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  ActivityIndicator,
  NavBar,
  Icon,
  WingBlank,
  WhiteSpace,
} from 'antd-mobile';

import { BookCard } from '../reusables/BookCard';
import { errorDialog, successDialog } from '../functions';
import { UserContext } from './Layout';

class BookDetailTobeRequested extends Component {
  state = {
    requestSuccess: false,
    backToDiscover: false,
    book: null,
    isLoading: true,
  };

  componentDidMount() {
    const bookId = this.props.match.params.id;
    Meteor.call('getABook', bookId, (error, respond) => {
      this.setState({
        book: respond,
        isLoading: false,
      });
    });
  }

  makeRequest = () => {
    const { currentUser } = this.context;
    const { book } = this.state;

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
        this.setState({
          requestSuccess: respond,
        });
      }
    });
  };

  render() {
    const { book, requestSuccess, backToDiscover } = this.state;

    if (requestSuccess) {
      return <Redirect to={`/request/${requestSuccess}`} />;
    }

    if (backToDiscover) {
      return <Redirect to="/discover" />;
    }

    if (!book) {
      return (
        <ActivityIndicator toast text="Loading book details..." />
      );
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

BookDetailTobeRequested.contextType = UserContext;

export default BookDetailTobeRequested;
