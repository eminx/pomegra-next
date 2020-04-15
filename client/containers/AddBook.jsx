import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {
  ActivityIndicator,
  Icon,
  NavBar,
  SearchBar,
  List,
} from 'antd-mobile';
import { FadeInUp } from 'animate-components';

import { UserContext } from './Layout';
import BookDetailTobeAdded from './BookDetailTobeAdded';
import { successDialog, errorDialog } from '../functions';
import BookCardNext from '../reusables/BookCardNext';

const googleApi = 'https://www.googleapis.com/books/v1/volumes?q=';

const ListItem = List.Item;

class AddBook extends Component {
  state = {
    isLoading: false,
    searchResults: [],
    searchbarInput: '',
    searchbarFocused: false,
    openBook: null,
    backToShelf: false,
  };

  componentDidMount() {
    this.autoFocusSearchBar();
  }

  autoFocusSearchBar = () => {
    this.searchBar && this.searchBar.focus();
  };

  searchbarSearch = () => {
    this.setState({
      isLoading: true,
    });
    const keyword = this.state.searchbarInput;
    fetch(googleApi + keyword)
      .then((results) => {
        return results.json();
      })
      .then((parsedResults) => {
        this.setState({
          isLoading: false,
          searchResults: parsedResults.items,
        });
      });
  };

  handleToggleBook = (index) => {
    this.setState(({ openBook }) => {
      if (openBook === index) {
        return { openBook: null };
      } else {
        return { openBook: index };
      }
    });
  };

  insertBook = (book) => {
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

      successDialog(
        'Book is successfully added to your virtual shelf',
      );
      this.setState({
        openBook: null,
      });
    });
  };

  alreadyOwnsBook = (book) => {
    const { currentUser } = this.props;
    return Books.findOne({
      b_title: book.b_title,
      added_by: currentUser._id,
    });
  };

  closeModal = () => {
    this.setState(
      {
        openBook: null,
      },
      () => {
        this.autoFocusSearchBar();
      },
    );
  };

  render() {
    const { currentUser, userLoading } = this.context;
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
      openBook,
    } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          leftContent={<Icon type="left" />}
          onLeftClick={() =>
            this.setState({
              backToShelf: true,
            })
          }
        >
          Add book to your virtual shelf
        </NavBar>
        <SearchBar
          placeholder="title, author, ISBN etc"
          value={searchbarInput}
          onChange={(value) =>
            this.setState({ searchbarInput: value })
          }
          onSubmit={() => this.searchbarSearch()}
          cancelText="Cancel"
          ref={(ref) => (this.searchBar = ref)}
        />

        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 50,
            }}
          >
            <ActivityIndicator text="Loading..." />
          </div>
        )}

        <div style={{ paddingTop: 24 }}>
          {searchResults &&
            searchResults.map((result, index) => (
              <FadeInUp
                key={result.id}
                duration=".5s"
                timingFunction="ease"
              >
                <BookCardNext
                  volumeInfo={result.volumeInfo}
                  onClickBook={() => this.handleToggleBook(index)}
                  isOpen={openBook === index}
                  onAddButtonClick={() =>
                    this.insertBook(result.volumeInfo)
                  }
                />
              </FadeInUp>
            ))}
        </div>
      </div>
    );
  }
}

AddBook.contextType = UserContext;

export default AddBook;
