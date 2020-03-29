import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { WhiteSpace, Result } from 'antd-mobile';
import {
  Card,
  CardHeader,
  CardHeaderTitle,
  CardHeaderIcon,
  CardImage,
  CardContent,
  Title,
  Subtitle,
  Media,
  MediaLeft,
  MediaContent,
  Content
} from 'bloomer';

const myImg = src => <img src={src} alt="" width={48} height={48} />;

const parseAuthors = ({ authors }) => {
  authors ? (
    authors.map((author, index) => (
      <span key={author}>
        {author + (authors.length !== index + 1 ? ', ' : '')}
      </span>
    ))
  ) : (
    <span>'unknownn authors'</span>
  );
};

class BookDetailTobeAdded extends PureComponent {
  render() {
    const { currentUser, bookInfo } = this.props;
    const volumeInfo = bookInfo && bookInfo.volumeInfo;

    if (!volumeInfo) {
      return null;
    }

    return (
      <div>
        <WhiteSpace size="lg" />
        <BookCard volumeInfo={volumeInfo} />
        <Result
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

const BookCard = ({ volumeInfo }) => (
  <Card>
    <CardHeader>
      <CardHeaderTitle>
        {volumeInfo.categories && volumeInfo.categories[0]}
      </CardHeaderTitle>
      {/* <Subtitle>{parseAuthors(volumeInfo.authors)}</Subtitle> */}
      <CardHeaderIcon>
        {volumeInfo.pageCount.toString() + 'p, ' + volumeInfo.printType}
      </CardHeaderIcon>
    </CardHeader>
    <CardImage>
      {myImg(volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail)}
    </CardImage>
    <CardContent>
      <Media>
        <MediaLeft>
          {myImg(volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail)}
        </MediaLeft>
        <MediaContent>
          <Title isSize={4}>{volumeInfo.title}</Title>
          <Subtitle isSize={6}>{parseAuthors(volumeInfo.authors)}</Subtitle>
        </MediaContent>
      </Media>
      <Content>
        {volumeInfo.description}
        <br />
        <small>{volumeInfo.publisher}</small>
        <small>{volumeInfo.publishedDate}</small>
        <small>{volumeInfo.industryIdentifiers[0].identifier}</small>
      </Content>
    </CardContent>
  </Card>
);

export default BookDetailTobeAddedContainer = withTracker(props => {
  const currentUser = Meteor.user();
  return {
    currentUser
  };
})(BookDetailTobeAdded);
