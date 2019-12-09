import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import {
  Page,
  Navbar,
  Block,
  Button,
  Subnavbar,
  Searchbar,
  NavRight,
  Link,
  List,
  ListItem,
  Preloader,
} from 'framework7-react';

const googleApi = 'https://www.googleapis.com/books/v1/volumes?q=';

class AddBook extends Component {
  state = {
    isLoading: false,
    searchResults: [],
    searchbarInput: '',
    searchbarFocused: false,
  };

  searchbarSearch = () => {
    this.setState({
      isLoading: true,
    });
    const keyword = this.state.searchbarInput;
    fetch(googleApi + keyword)
      .then(results => {
        return results.json();
      })
      .then(parsedResults => {
        this.setState({
          isLoading: false,
          searchResults: parsedResults.items,
          searchbarFocused: false,
        });
      });
  };

  viewBookInDetail = result => {
    this.$f7router.navigate('/book-detail-tobe-added/', {
      props: {
        bookInfo: result,
      },
    });
  };

  render() {
    const {
      searchResults,
      searchbarInput,
      searchbarFocused,
      isLoading,
    } = this.state;
    return (
      <Page name="add">
        <Navbar title="Add new book to your shelf" backLink />
        <Searchbar
          placeholder="title, author, ISBN etc"
          customSearch
          noShadow
          value={searchbarInput}
          onChange={event =>
            this.setState({ searchbarInput: event.target.value })
          }
          onFocus={() => this.setState({ searchbarFocused: true })}
        ></Searchbar>

        <Block className="text-align-center">
          {!isLoading && searchbarFocused && (
            <Button onClick={() => this.searchbarSearch()}>Search</Button>
          )}
          {isLoading && <Preloader />}
        </Block>

        <List mediaList>
          {searchResults &&
            searchResults.length > 0 &&
            searchResults.map(result => (
              <ListItem
                mediaItem
                key={result.id || result.volumeInfo.title}
                link="#"
                after={
                  result.volumeInfo.categories &&
                  result.volumeInfo.categories[0]
                }
                title={result.volumeInfo.title}
                subtitle={
                  result.volumeInfo.authors &&
                  result.volumeInfo.authors.map(author => <span>{author}</span>)
                }
                text={result.volumeInfo.description}
                onClick={() => this.viewBookInDetail(result)}
              >
                <img
                  slot="media"
                  src={
                    result.volumeInfo.imageLinks &&
                    result.volumeInfo.imageLinks.smallThumbnail
                  }
                  width={40}
                  height={60}
                />
              </ListItem>
            ))}
        </List>

        <Block center>Type and press enter</Block>
      </Page>
    );
  }
}

export default AddBookContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
})(AddBook);
