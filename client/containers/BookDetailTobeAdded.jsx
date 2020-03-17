import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { WhiteSpace, Result } from 'antd-mobile';

const myImg = src => <img src={src} alt="" width={48} height={66} />;

class BookDetailTobeAdded extends PureComponent {
  render() {
    const { currentUser, bookInfo } = this.props;
    const volumeInfo = bookInfo && bookInfo.volumeInfo;

    if (!volumeInfo) {
      return null;
    }

    const authors = (
      <div
        style={{
          padddingTop: 12,
          fontWeight: 'lighter',
          wordBreak: 'break-all',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
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
      <div>
        <WhiteSpace size="lg" />
        <Result
          img={volumeInfo.imageLinks && myImg(volumeInfo.imageLinks.thumbnail)}
          title={volumeInfo.title}
          message="Yes I own a copy of this book!"
          buttonText="Add to my virtual shelf"
          buttonType="primary"
          onButtonClick={() => this.props.insertBook(volumeInfo)}
        />
        <WhiteSpace />
        Add to my Wishlist
      </div>
    );
  }
}

export default BookDetailTobeAddedContainer = withTracker(props => {
  const currentUser = Meteor.user();
  return {
    currentUser
  };
})(BookDetailTobeAdded);
