import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment, PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { WhiteSpace, WingBlank, Modal, NavBar, Icon } from 'antd-mobile';

import { BookCard } from '../reusables/BookCard';

const myImg = src => <img src={src} alt="" width={48} height={66} />;

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

  render() {
    const { currentUser, book } = this.props;
    const { isEditDialogOpen, backToBooks } = this.state;

    if (backToBooks) {
      return <Redirect to="my-books" />;
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
          title="Edit Details of the Book"
        >
          edit dialog
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
