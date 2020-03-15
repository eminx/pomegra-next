import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  WhiteSpace,
  NavBar,
  List,
  Subnavbar,
  SearchBar,
  Button,
  Picker
} from 'antd-mobile';

import AppTabBar from '../reusables/AppTabBar';

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
    filterValue: ''
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
    const { sortBy, filterValue } = this.state;

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
          <List.Item arrow="horizontal">{sortBy}</List.Item>
        </Picker>

        <WhiteSpace size="md" />

        <List className="larger-thumb-list">
          {filteredSortedBooks &&
            filteredSortedBooks.map(myBook => (
              <List.Item
                key={myBook._id}
                thumb={myBook.image_url}
                align="top"
                extra={myBook.b_cat}
                onClick={() => this.viewBookInDetail(myBook)}
              >
                <b>{myBook.b_title}</b>
                <List.Item.Brief>{myBook.b_author}</List.Item.Brief>
              </List.Item>
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
