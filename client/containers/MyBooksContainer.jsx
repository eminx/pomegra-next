import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import {
  WhiteSpace,
  NavBar,
  List,
  Flex,
  SearchBar,
  Button,
  Picker
} from 'antd-mobile';
import { GoPlus } from 'react-icons/go';
import { IoMdAddCircle } from 'react-icons/io';

import AppTabBar from '../reusables/AppTabBar';

const ListItem = List.Item;
const Brief = ListItem.Brief;

const sortByMethods = [
  'last added',
  'book title',
  'book author',
  'book language',
  'request condition'
];

class MyBooks extends Component {
  state = {
    sortBy: 'last added',
    filterValue: '',
    gotoAddBook: false
  };

  viewBookInDetail = myBook => {
    this.setState({});
  };

  handleSortByChange = value => {
    this.setState({
      sortBy: value[0]
    });
  };

  handleFilter = value => {
    this.setState({ filterValue: value });
  };

  sortedBooks = () => {
    const { myBooks } = this.props;
    const { sortBy } = this.state;

    if (!myBooks) {
      return;
    }

    switch (sortBy) {
      case 'book title':
        return myBooks.sort((a, b) => a.b_title.localeCompare(b.b_title));
      case 'book author':
        return myBooks.sort(
          (a, b) => a.b_author && a.b_author.localeCompare(b.b_author)
        );
      case 'request condition':
        return myBooks.sort(
          (a, b) =>
            b.on_request - a.on_request ||
            b.on_acceptance - a.on_acceptance ||
            b.on_lend - a.on_lend
        );
      case 'language':
        return myBooks.sort((a, b) => a.b_lang.localeCompare(b.b_lang));
      default:
        return myBooks.sort((a, b) => b.date_added - a.date_added);
    }
  };

  render() {
    const { sortBy, filterValue, gotoAddBook } = this.state;

    if (gotoAddBook) {
      return <Redirect to="/add" />;
    }

    const sortedBooks = this.sortedBooks();

    if (!sortedBooks) {
      return null;
    }

    const filteredSortedBooks = sortedBooks.filter(book => {
      return (
        book.b_title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        book.b_author.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        book.b_cat.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
      );
    });

    return (
      <div>
        <NavBar mode="light">My Books</NavBar>

        <Flex justify="center" direction="column">
          <WhiteSpace />
          <Button
            inline
            icon={<IoMdAddCircle size={24} />}
            onClick={() => this.setState({ gotoAddBook: true })}
          >
            Add Book
          </Button>
          <WhiteSpace />
        </Flex>

        <SearchBar
          placeholder="Filter"
          cancelText="Cancel"
          onChange={value => this.handleFilter(value)}
          onClear={() => this.setState({ filterValue: '' })}
        />

        <Picker
          title="Sort by"
          extra="change"
          data={sortByMethods.map(method => ({ value: method, label: method }))}
          cols={1}
          okText="Confirm"
          dismissText="Cancel"
          onOk={value => this.handleSortByChange(value)}
        >
          <Flex justify="center">
            <Anchor label="sorted by" style={{ marginTop: 12 }}>
              {sortBy}
            </Anchor>
          </Flex>
        </Picker>

        <WhiteSpace size="md" />

        <List className="larger-thumb-list">
          {filteredSortedBooks &&
            filteredSortedBooks.map(myBook => (
              <ListItem
                key={myBook._id}
                align="top"
                thumb={
                  <img
                    style={{ width: 33, height: 44 }}
                    src={myBook.image_url}
                  />
                }
                extra={myBook.b_cat}
                onClick={() => this.viewBookInDetail(myBook)}
              >
                <b>{myBook.b_title}</b>
                <Brief>{myBook.b_author}</Brief>
              </ListItem>
            ))}
        </List>
        <AppTabBar />
      </div>
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

const Anchor = ({ label, children, ...otherProps }) => (
  <span {...otherProps}>
    <span>{label} </span>
    <a
      {...otherProps}
      href="#"
      style={{
        color: '#108ee9',
        borderBottom: '1px solid #108ee9'
      }}
    >
      {children}
    </a>
  </span>
);
