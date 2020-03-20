import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment, PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { WhiteSpace, WingBlank, Modal, NavBar, Icon } from 'antd-mobile';

import { BookCard } from '../reusables/BookCard';
import EditBook from '../reusables/EditBook';
import { errorDialog, successDialog } from '../functions';

class MyBook extends PureComponent {
  state = {
    isEditDialogOpen: false,
    backToBooks: false
  };

  openEditDialog = () => {
    this.setState({
      isEditDialogOpen: true
    });
  };

  closeEditDialog = () => {
    this.setState({
      isEditDialogOpen: false
    });
  };

  updateBook = values => {
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
    const { currentUser, book } = this.props;
    const { isEditDialogOpen, backToBooks } = this.state;

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
            <WingBlank>
              <BookCard
                book={book}
                onButtonClick={this.openEditDialog}
                buttonType="ghost"
                buttonText="Edit"
              />
            </WingBlank>
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

export default MyBookContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const bookId = props.match.params.id;
  const bookSub = Meteor.subscribe('singleBook', bookId);
  const book = currentUser && Books.findOne(bookId);
  const isLoading = !bookSub.ready();

  return {
    currentUser,
    book,
    isLoading
  };
})(MyBook);
