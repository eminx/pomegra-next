import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {
  ActivityIndicator,
  Button,
  Icon,
  Flex,
  Modal,
  NavBar,
  SearchBar,
} from 'antd-mobile';
import { FadeInUp } from 'animate-components';

import { UserContext } from './Layout';
import {
  successDialog,
  errorDialog,
  resizeImage,
  uploadImage,
  call,
} from '../functions';
import BookCardNext from '../reusables/BookCardNext';
import ManuallyAddBookForm from '../reusables/ManuallyAddBookForm';

const googleApi = 'https://www.googleapis.com/books/v1/volumes?q=';

const formValuesModel = {
  title: '',
  author1: '',
  language: [],
  category: '',
  description: '',
  ISBN: '',
  numberOfAuthors: 1,
};

class AddBook extends Component {
  state = {
    isLoading: false,
    searchResults: [],
    searchbarInput: '',
    searchbarFocused: false,
    openBook: null,
    backToShelf: false,
    bookImage: null,
    uploadedBookImage: null,
    unSavedImageChange: false,
    formValues: formValuesModel,
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

  insertBook = async (book) => {
    if (this.alreadyOwnsBook(book)) {
      errorDialog('You already own this book');
      return;
    }

    try {
      await call('insertBook', book);
      successDialog(
        'Book is successfully added to your virtual shelf',
        1,
      );
      this.setState({
        openBook: null,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    }
  };

  handleFormChange = (field, value, authorIndex) => {
    const { formValues } = this.state;
    const newformValues = {
      ...formValues,
    };
    newformValues[field] = value;
    this.setState({ formValues: newformValues });
  };

  handleAddAuthor = () => {
    const { formValues } = this.state;
    const nthAuthor = formValues.numberOfAuthors + 1;
    const newformValues = {
      ...formValues,
      numberOfAuthors: nthAuthor,
    };
    newformValues['author' + nthAuthor.toString()] = '';
    this.setState({
      formValues: newformValues,
    });
  };

  handleRemoveAuthor = () => {
    const { formValues } = this.state;
    const nthAuthor = formValues.numberOfAuthors - 1;
    const newformValues = {
      ...formValues,
      numberOfAuthors: nthAuthor,
    };
    delete newformValues[
      'author' + formValues.numberOfAuthors.toString()
    ];
    this.setState({
      formValues: newformValues,
    });
  };

  handleImagePick = (images, type, index) => {
    if (type === 'remove') {
      this.setState({
        bookImage: null,
        unSavedImageChange: true,
      });
      return;
    }
    this.setState({
      bookImage: images[0],
      unSavedImageChange: true,
    });
  };

  uploadBookImage = async () => {
    const { bookImage } = this.state;

    try {
      const resizedImage = await resizeImage(bookImage.file, 400);
      const uploadedImage = await uploadImage(
        resizedImage,
        'bookImageUpload',
      );
      const uploadedBookImage = {
        name: bookImage.file.name,
        url: uploadedImage,
        uploadDate: new Date(),
      };
      this.setState(
        {
          uploadedBookImage,
        },
        this.insertBookManually,
      );
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  insertBookManually = async () => {
    const { uploadedBookImage, formValues } = this.state;
    if (!uploadedBookImage) {
      errorDialog('Please add image');
    }

    if (this.alreadyOwnsBook(formValues)) {
      errorDialog('You already own this book');
      return;
    }

    let authorsNr = [];
    for (let i = 1; i <= formValues.numberOfAuthors; i++) {
      authorsNr.push(i.toString());
    }

    const authors = authorsNr.map((a) => {
      return formValues[`author${a}`];
    });

    const book = {
      ...formValues,
      authors,
      imageInfo: uploadedBookImage,
      imageUrl: uploadedBookImage.url,
      titleLowerCase: formValues.title.toLowerCase(),
      authorsLowerCase: authors.map((author) => author.toLowerCase()),
    };

    try {
      await call('insertBookManually', book);
      successDialog(
        'Book is successfully added to your virtual shelf',
        1,
      );
      this.setState({
        formValues: formValuesModel,
        bookImage: null,
        uploadedBookImage: null,
        unSavedImageChange: false,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    }
  };

  alreadyOwnsBook = (book) => {
    const { currentUser } = this.context;
    return Books.findOne({
      title: book.title,
      ownerId: currentUser._id,
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
    const {
      searchResults,
      searchbarInput,
      isLoading,
      openBook,
      backToShelf,
      bookImage,
      formValues,
      isformValuesOpen,
    } = this.state;

    if (backToShelf) {
      return <Redirect to="/my-shelf" />;
    }

    if (!currentUser) {
      <ActivityIndicator toast text="Loading..." />;
    }

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
                  isDark
                  volumeInfo={result.volumeInfo}
                  onClickBook={() => this.handleToggleBook(index)}
                  isOpen={openBook === index}
                  buttonText="Add to My Shelf"
                  onButtonClick={() =>
                    this.insertBook(result.volumeInfo)
                  }
                />
              </FadeInUp>
            ))}
        </div>

        <Flex justify="center">
          <Button
            type="ghost"
            onClick={() => this.setState({ isformValuesOpen: true })}
            size="small"
          >
            Manually Add Book
          </Button>
        </Flex>

        <Modal
          visible={isformValuesOpen}
          closable
          onClose={() => this.setState({ isformValuesOpen: false })}
        >
          <ManuallyAddBookForm
            values={formValues}
            bookImage={bookImage}
            onImagePick={this.handleImagePick}
            onFormChange={this.handleFormChange}
            onAddAuthor={this.handleAddAuthor}
            onRemoveAuthor={this.handleRemoveAuthor}
            onSave={this.uploadBookImage}
            onClose={() => this.setState({ isformValuesOpen: false })}
          />
        </Modal>
      </div>
    );
  }
}

AddBook.contextType = UserContext;

export default AddBook;
