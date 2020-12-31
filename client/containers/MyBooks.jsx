import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  ActivityIndicator,
  WhiteSpace,
  WingBlank,
  NavBar,
  List,
  Flex,
  SearchBar,
  Picker,
} from 'antd-mobile';
import { Button, Title, Subtitle } from 'bloomer';
import { IoMdAddCircle } from 'react-icons/io';

import { UserContext } from './Layout';
import Anchor from '../reusables/Anchor';

const ListItem = List.Item;
const Brief = ListItem.Brief;

const sortByMethods = [
  'last added',
  'book title',
  'book author',
  'book language',
  'request condition',
];

class MyBooks extends Component {
  state = {
    sortBy: 'last added',
    filterValue: '',
    gotoAddBook: false,
    gotoSingleBook: false,
    isLoading: true,
    myBooks: [],
  };

  componentDidMount() {
    Meteor.call('getMyBooks', (error, respond) => {
      this.setState({
        myBooks: respond,
        isLoading: false,
      });
    });
  }

  viewBookInDetail = (book) => {
    this.setState({ gotoSingleBook: book._id });
  };

  handleSortByChange = (value) => {
    this.setState({
      sortBy: value[0],
    });
  };

  handleFilter = (value) => {
    this.setState({ filterValue: value });
  };

  sortedBooks = () => {
    const { myBooks, sortBy } = this.state;

    if (!myBooks || myBooks.length === 0) {
      return;
    }

    switch (sortBy) {
      case 'book title':
        return myBooks.sort((a, b) =>
          a.b_title.localeCompare(b.b_title),
        );
      case 'book author':
        return myBooks.sort(
          (a, b) =>
            a.b_author && a.b_author.localeCompare(b.b_author),
        );
      case 'request condition':
        return myBooks.sort(
          (a, b) =>
            b.on_request - a.on_request ||
            b.on_acceptance - a.on_acceptance ||
            b.on_lend - a.on_lend,
        );
      case 'language':
        return myBooks.sort((a, b) =>
          a.b_lang.localeCompare(b.b_lang),
        );
      default:
        return myBooks.sort((a, b) => b.date_added - a.date_added);
    }
  };

  filteredSortedBooks = (sortedBooks) => {
    const { filterValue } = this.state;
    return sortedBooks.filter((book) => {
      return (
        (book.b_title &&
          book.b_title
            .toLowerCase()
            .indexOf(filterValue.toLowerCase()) !== -1) ||
        (book.b_author &&
          book.b_author
            .toLowerCase()
            .indexOf(filterValue.toLowerCase()) !== -1) ||
        book.b_cat &
          (book.b_cat
            .toLowerCase()
            .indexOf(filterValue.toLowerCase()) !==
            -1)
      );
    });
  };

  render() {
    const {
      sortBy,
      gotoAddBook,
      gotoSingleBook,
      isLoading,
      myBooks,
    } = this.state;

    if (gotoAddBook) {
      return <Redirect to="/add" />;
    } else if (gotoSingleBook) {
      return <Redirect to={`/my-book/${gotoSingleBook}`} />;
    }

    const sortedBooks = this.sortedBooks();

    const filteredSortedBooks =
      sortedBooks && this.filteredSortedBooks(sortedBooks);

    return (
      <div>
        <NavBar mode="light">My Books</NavBar>

        <Flex justify="center" direction="column">
          <WhiteSpace />
          <Button
            isColor="light"
            isLink
            isOutlined
            className="is-rounded"
            onClick={() => this.setState({ gotoAddBook: true })}
          >
            Add Book
          </Button>
          <WhiteSpace />
        </Flex>

        <SearchBar
          placeholder="Filter"
          cancelText="Cancel"
          onChange={(value) => this.handleFilter(value)}
          onClear={() => this.setState({ filterValue: '' })}
          style={{ touchAction: 'none' }}
        />

        <Picker
          title="Sort by"
          extra="change"
          data={sortByMethods.map((method) => ({
            value: method,
            label: method,
          }))}
          cols={1}
          okText="Confirm"
          dismissText="Cancel"
          value={[sortBy]}
          onOk={(value) => this.handleSortByChange(value)}
        >
          <Flex justify="center">
            <Anchor label="sorted by" style={{ marginTop: 12 }}>
              {sortBy}
            </Anchor>
          </Flex>
        </Picker>

        <WhiteSpace size="md" />

        {filteredSortedBooks ? (
          <List style={{ marginBottom: 80 }}>
            {filteredSortedBooks.map((book) => (
              <ListItem
                key={book._id}
                align="top"
                thumb={
                  <img
                    style={{ width: 33, height: 44 }}
                    src={book.image_url}
                  />
                }
                extra={book.b_cat}
                onClick={() => this.viewBookInDetail(book)}
              >
                <b>{book.b_title}</b>
                <Brief>{book.b_author}</Brief>
              </ListItem>
            ))}
          </List>
        ) : (
          isLoading && (
            <ActivityIndicator text="Loading your books..." />
          )
        )}

        {myBooks && myBooks.length === 0 && (
          <WingBlank>
            <Title isSize={4} hasTextAlign="centered">
              No books
            </Title>
            <Subtitle isSize={6} hasTextAlign="centered">
              You don't have any books in your shelf yet. Please add
              new books
            </Subtitle>
          </WingBlank>
        )}
      </div>
    );
  }
}

MyBooks.contextType = UserContext;

export default MyBooks;