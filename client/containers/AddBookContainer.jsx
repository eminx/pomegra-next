import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import {
  ActivityIndicator,
  Icon,
  NavBar,
  SearchBar,
  List,
  Modal
} from 'antd-mobile';

import BookDetailTobeAdded from './BookDetailTobeAdded';
import { successDialog, errorDialog, parseUrlForSSL } from '../functions';
import { Redirect } from 'react-router-dom';

const googleApi = 'https://www.googleapis.com/books/v1/volumes?q=';

const ListItem = List.Item;
const Brief = ListItem.Brief;

class AddBook extends Component {
  state = {
    isLoading: false,
    searchResults: [],
    searchbarInput: '',
    searchbarFocused: false,
    bookInDetail: null,
    backToShelf: false
  };

  componentDidMount() {
    this.autoFocusSearchBar();
  }

  autoFocusSearchBar = () => {
    this.searchBar && this.searchBar.focus();
  };

  searchbarSearch = () => {
    this.setState({
      isLoading: true
    });
    const keyword = this.state.searchbarInput;
    fetch(googleApi + keyword)
      .then(results => {
        return results.json();
      })
      .then(parsedResults => {
        this.setState({
          isLoading: false,
          searchResults: parsedResults.items
        });
      });
  };

  viewBookInDetail = result => {
    this.setState({
      bookInDetail: result
    });
  };

  insertBook = book => {
    // if (this.alreadyOwnsBook(book)) {
    //   errorDialog('You already own this book');
    //   return;
    // }

    Meteor.call('insertBook', book, (error, respond) => {
      console.log(respond);
      if (error) {
        errorDialog(error.reason);
      } else if (respond && respond.error) {
        errorDialog(respond.error);
      }
      successDialog('Book is successfully added to your virtual shelf');
      this.closeModal();
    });
  };

  alreadyOwnsBook = book => {
    const { currentUser } = this.props;
    return Books.findOne({
      b_title: book.b_title,
      added_by: currentUser._id
    });
  };

  closeModal = () => {
    this.setState(
      {
        bookInDetail: null
      },
      () => {
        this.autoFocusSearchBar();
      }
    );
  };

  render() {
    const { currentUser } = this.props;
    const { backToShelf } = this.state;

    if (backToShelf) {
      return <Redirect to="/my-shelf" />;
    }

    if (!currentUser) {
      <ActivityIndicator toast text="Loading..." />;
    }

    const {
      searchResults,
      searchbarInput,
      isLoading,
      bookInDetail
    } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          leftContent={<Icon type="left" />}
          onLeftClick={() =>
            this.setState({
              backToShelf: true
            })
          }
        >
          Add book to your virtual shelf
        </NavBar>
        <SearchBar
          placeholder="title, author, ISBN etc"
          value={searchbarInput}
          onChange={value => this.setState({ searchbarInput: value })}
          onSubmit={() => this.searchbarSearch()}
          cancelText="Cancel"
          ref={ref => (this.searchBar = ref)}
        />

        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 50
            }}
          >
            <ActivityIndicator text="Loading..." />
          </div>
        )}

        <List>
          {searchResults &&
            searchResults.length > 0 &&
            searchResults.map(result => (
              <ListItem
                key={result.id || result.volumeInfo.title}
                align="top"
                thumb={
                  <img
                    style={{ width: 33, height: 44 }}
                    src={
                      result.volumeInfo.imageLinks &&
                      parseUrlForSSL(
                        result.volumeInfo.imageLinks.smallThumbnail
                      )
                    }
                  />
                }
                extra={
                  result.volumeInfo.categories &&
                  result.volumeInfo.categories[0]
                }
                onClick={() => this.viewBookInDetail(result)}
              >
                <b>{result.volumeInfo.title}</b>
                <Brief>
                  {result.volumeInfo.authors &&
                    result.volumeInfo.authors.map(author => (
                      <span key={author}>{author}</span>
                    ))}
                </Brief>
              </ListItem>
            ))}
        </List>
        <Modal
          visible={currentUser && bookInDetail}
          // position="top"
          closable
          onClose={() => this.setState({ bookInDetail: null })}
          title="Do you own a copy?"
        >
          <BookDetailTobeAdded
            bookInfo={bookInDetail}
            insertBook={this.insertBook}
          />
        </Modal>
      </div>
    );
  }
}

export default AddBookContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  return {
    currentUser
  };
})(AddBook);
