import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Page,
  Navbar,
  List,
  ListItem,
  Subnavbar,
  Searchbar,
  Actions,
  ActionsGroup,
  ActionsLabel,
  ActionsButton,
  Button,
  Block
} from 'framework7-react';

const sortByMethods = [
  'last added',
  'book title',
  'book author',
  'book language',
  'request condition'
];

class MyBooks extends Component {
  state = {
    sortBy: 'last added'
  };

  viewBookInDetail = myBook => {
    this.$f7router.navigate('/book-detail/', {
      props: {
        myBook
      }
    });
  };

  sortedBooks = () => {
    const { myBooks } = this.props;
    const { sortBy } = this.state;

    let sortedBooks;

    switch (sortBy) {
      case 'book title':
        sortedBooks = myBooks.sort((a, b) =>
          a.b_title.localeCompare(b.b_title)
        );
        break;
      case 'book author':
        sortedBooks = myBooks.sort((a, b) =>
          a.b_author.localeCompare(b.b_author)
        );
        break;
      case 'request condition':
        sortedBooks = myBooks.sort(
          (a, b) =>
            b.on_request - a.on_request ||
            b.on_acceptance - a.on_acceptance ||
            b.on_lend - a.on_lend
        );
        break;
      case 'language':
        sortedBooks = myBooks.sort((a, b) => a.b_lang.localeCompare(b.b_lang));
        break;
      default:
        sortedBooks = myBooks.sort((a, b) => b.date_added - a.date_added);
    }

    return sortedBooks;
  };

  render() {
    const { sortBy } = this.state;

    const sortedBooks = this.sortedBooks();

    return (
      <Page name="books">
        <Navbar backLink title="My Books">
          <Subnavbar inner={false}>
            <Searchbar
              searchContainer=".search-list"
              searchIn=".item-title, .item-subtitle"
              disableButton={!this.$theme.aurora}
              placeholder="Filter"
            ></Searchbar>
          </Subnavbar>
        </Navbar>
        <Block>
          sorted by{' '}
          <Button onClick={() => this.refs.sortActions.open()}>{sortBy}</Button>
          <Actions ref="sortActions">
            <ActionsGroup>
              <ActionsLabel style={{ textAlign: 'center' }}>
                sort books by
              </ActionsLabel>

              {sortByMethods.map(method => (
                <ActionsButton
                  key={method}
                  bold={sortBy === method}
                  onClick={() => this.setState({ sortBy: method })}
                >
                  {method}
                </ActionsButton>
              ))}
            </ActionsGroup>
          </Actions>
        </Block>

        <List className="searchbar-not-found">
          <ListItem title="Nothing found" />
        </List>
        <List mediaList className="search-list searchbar-found">
          {sortedBooks &&
            sortedBooks.map(myBook => (
              <ListItem
                mediaItem
                key={myBook._id}
                link="#"
                after={myBook.b_cat}
                title={myBook.b_title}
                subtitle={myBook.b_author}
                // text={myBook.description}
                onClick={() => this.viewBookInDetail(myBook)}
              >
                <img
                  slot="media"
                  src={myBook.image_url}
                  width={40}
                  height={60}
                />
              </ListItem>
            ))}
        </List>
      </Page>
    );
  }
}

export default MyBooksContainer = withTracker(props => {
  const currentUser = Meteor.user();
  Meteor.subscribe('myBooks');
  const myBooks =
    currentUser && Books.find({ added_by: currentUser._id }).fetch();

  return {
    currentUser,
    myBooks
  };
})(MyBooks);
