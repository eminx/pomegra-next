import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Block, Page, Navbar, Link } from 'framework7-react';

import BookCard from '../../imports/ui/BookCard';

class BookDetailTobeAdded extends Component {
  state = {};

  insertBook = book => {
    const { currentUser } = this.props;
    const bookExists = Books.findOne({
      b_title: book.b_title,
      added_by: currentUser._id,
    });

    if (bookExists) {
      const app = this.$f7;
      const notification = app.notification.create({
        icon: '<i class="icon demo-icon"></i>',
        title: 'Book already added',
        subtitle:
          'A book with same title is already added to your virtual shelf',
        closeButton: true,
        closeTimeout: 10000,
        opened: true,
      });
      notification.open();
      this.$f7router.back();
    }

    Meteor.call('insertBook', book, (error, respond) => {
      if (!error) {
        // Create notification with click to close
        this.showSuccessNotification();
        this.$f7router.back();
      }
    });
  };

  showSuccessNotification = () => {
    const app = this.$f7;
    const notification = app.notification.create({
      icon: '<i class="icon demo-icon"></i>',
      title: 'Book added',
      subtitle: 'Your book is now added to your shelf',
      closeButton: true,
      closeTimeout: 10000,
      opened: true,
    });
    notification.open();
  };

  render() {
    const { currentUser, bookInfo } = this.props;
    const volumeInfo = bookInfo.volumeInfo;

    const authors = (
      <div
        style={{
          padddingTop: 12,
          fontWeight: 'lighter',
          wordBreak: 'break-all',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {volumeInfo.authors &&
          volumeInfo.authors.map((author, index) => (
            <span key={author}>
              {author + (volumeInfo.authors.length !== index + 1 ? ', ' : '')}
            </span>
          ))}
      </div>
    );

    return (
      <Page name="books">
        <Navbar title="Do you own a copy of this book?" backLink />
        <Block style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link>Add to my Wishlist</Link>
          <Link onClick={() => this.insertBook(volumeInfo)}>Yes I do</Link>
        </Block>

        <BookCard
          volumeInfo={volumeInfo}
          footerComponents={
            <Link onClick={() => this.insertBook(volumeInfo)}>
              Yes, I own a copy. Please add to my shelf
            </Link>
          }
        />
      </Page>
    );
  }
}

export default BookDetailTobeAddedContainer = withTracker(props => {
  const currentUser = Meteor.user();
  return {
    currentUser,
  };
})(BookDetailTobeAdded);
