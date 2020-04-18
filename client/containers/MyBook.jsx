import { Meteor } from 'meteor/meteor';
import React, { Fragment, PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import {
  WhiteSpace,
  WingBlank,
  Modal,
  NavBar,
  Icon,
} from 'antd-mobile';

import { BookCard } from '../reusables/BookCard';
import BookCardNext from '../reusables/BookCardNext';
import EditBook from '../reusables/EditBook';
import { errorDialog, successDialog } from '../functions';
import { UserContext } from './Layout';

class MyBook extends PureComponent {
  state = {
    isEditDialogOpen: false,
    backToBooks: false,
    isLoading: true,
    book: null,
  };

  componentDidMount() {
    const bookId = this.props.match.params.id;
    Meteor.call('getMyBook', bookId, (error, respond) => {
      this.setState({
        book: respond,
        isLoading: false,
      });
    });
  }

  openEditDialog = () => {
    this.setState({
      isEditDialogOpen: true,
    });
  };

  closeEditDialog = () => {
    this.setState({
      isEditDialogOpen: false,
    });
  };

  updateBook = (values) => {
    const { book } = this.props;

    if (values.language) {
      values.b_lang = values.language[0];
    } else {
      values.b_lang = book.b_lang;
    }

    Meteor.call('updateBook', book._id, values, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
      } else {
        successDialog('Your book is successfully updated');
      }
    });
  };

  render() {
    const { currentUser, userLoading } = this.context;
    const {
      book,
      isEditDialogOpen,
      backToBooks,
      openBook,
    } = this.state;

    if (backToBooks) {
      return <Redirect to="/my-shelf" />;
    }

    return (
      <div>
        <NavBar
          mode="light"
          leftContent={<Icon type="left" />}
          onLeftClick={() => this.setState({ backToBooks: true })}
          rightContent={<Icon type="ellipsis" />}
        >
          Details
        </NavBar>

        {book && (
          <Fragment>
            <WhiteSpace size="lg" />
            <BookCard
              book={book}
              onButtonClick={this.openEditDialog}
              buttonType="ghost"
              buttonText="Edit"
            />
          </Fragment>
        )}

        <Modal
          visible={currentUser && isEditDialogOpen}
          position="top"
          closable
          onClose={this.closeEditDialog}
          title="Edit Book"
        >
          <EditBook book={book} onSubmit={this.updateBook} />
        </Modal>
      </div>
    );
  }
}

MyBook.contextType = UserContext;

export default MyBook;
