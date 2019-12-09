import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AccordionContent,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Appbar,
  Block,
  Page,
  Navbar,
  Toolbar,
  Button,
  Link,
  List,
  ListItem,
  LoginScreen,
  LoginScreenTitle,
  BlockFooter,
  ListButton,
  ListInput,
} from 'framework7-react';

class BookDetailTobeAdded extends Component {
  state = {};

  insertBook = book => {
    Meteor.call('insertBook', book, (error, respond) => {
      if (!error) {
        console.log(respond);
      }
    });
  };

  render() {
    const { currentUser, bookInfo } = this.props;
    const volumeInfo = bookInfo.volumeInfo;

    const authors = (
      <div style={{ textAlign: 'right', fontWeight: 'lighter' }}>
        {volumeInfo.authors &&
          volumeInfo.authors.map((author, index) => (
            <span key={author}>
              {author}
              {volumeInfo.authors.length !== index + 1 && ', '}
            </span>
          ))}
      </div>
    );

    const detailListItemStyle = {
      justifyContent: 'flex-end',
      height: 18,
      fontSize: 12,
    };

    return (
      <Page name="books">
        <Navbar title="Do you own a copy of this book?" backLink></Navbar>
        <Block style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link>Add to my Wishlist</Link>
          <Link onClick={() => this.insertBook(volumeInfo)}>Yes I do</Link>
        </Block>
        <Card className="demo-card-header-pic" title={volumeInfo.title}>
          <CardHeader
            className="no-border"
            valign="bottom"
            style={
              volumeInfo.imageLinks && {
                backgroundImage: `url(${volumeInfo.imageLinks.thumbnail})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: '#010101',
                height: 120,
                backgroundSize: 'contain',
              }
            }
          ></CardHeader>
          <CardContent>
            <Block>
              <List
                simpleList
                style={{ paddingTop: 12, paddingBottom: 12 }}
                noHairlinesBetween
              >
                <ListItem style={{ paddingLeft: 0 }}>{authors}</ListItem>
                <ListItem style={detailListItemStyle}>
                  {' '}
                  {volumeInfo.printType}, {volumeInfo.language.toUpperCase()},{' '}
                  {volumeInfo.publishedDate}
                </ListItem>
                <ListItem style={detailListItemStyle}>
                  {volumeInfo.publisher}
                </ListItem>
                <ListItem style={detailListItemStyle}>
                  {volumeInfo.categories && volumeInfo.categories[0]}
                </ListItem>
              </List>
            </Block>
            <p>{volumeInfo.description}</p>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Link>Close</Link> */}
            <Link onClick={() => this.insertBook(volumeInfo)}>
              Yes, I own a copy. Please add to my shelf
            </Link>
          </CardFooter>
        </Card>
        {/* <Toolbar position="bottom">
          <Link>Add to my Wishlist</Link>
          <Link>Yes I do</Link>
        </Toolbar> */}
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
