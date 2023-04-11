import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Icon, NavBar, Popup, SearchBar, Space } from "antd-mobile";
import { FadeInUp } from "animate-components";
import { Box, Flex } from "@chakra-ui/react";

import { UserContext } from "../Layout";
import {
  successDialog,
  errorDialog,
  resizeImage,
  uploadImage,
  call,
} from "../../api/_utils/functions";
import BookCardNext from "../components/BookCardNext";
import ManuallyAddBookForm from "../components/ManuallyAddBookForm";

const googleApi = "https://www.googleapis.com/books/v1/volumes?q=";

const formValuesModel = {
  title: "",
  author1: "",
  language: [],
  category: "",
  description: "",
  ISBN: "",
  numberOfAuthors: 1,
};

function AddBook() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchbarInput, setSearchbarInput] = useState("");
  const [openBook, setOpenBook] = useState(null);
  const [bookImage, setBookImage] = useState(null);
  const [uploadedBookImage, setUploadedBookImage] = useState(null);
  const [isUnsavedImageChange, setIsUnsavedImageChange] = useState(false);
  const [formValues, setFormValues] = useState(formValuesModel);
  const [isManuallyAddModalOpen, setIsManuallyAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { currentUser, userLoading } = useContext(UserContext);
  const searchbar = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    autoFocusSearchBar();
  }, []);

  useLayoutEffect(() => {
    if (uploadedBookImage) {
      insertBookManually();
    }
  }, uploadedBookImage);

  const autoFocusSearchBar = () => {
    this.searchBar && this.searchBar.focus();
  };

  const searchbarSearch = () => {
    setIsLoading(true);
    fetch(googleApi + searchbarInput)
      .then((results) => {
        return results.json();
      })
      .then((parsedResults) => {
        console.log(parsedResults);
        setSearchResults(parsedResults.items);
        setIsLoading(false);
      });
  };

  const handleToggleBook = (index) => {
    if (openBook === index) {
      return;
    }
    setOpenBook(index);
  };

  const insertBook = async (book) => {
    if (alreadyOwnsBook(book)) {
      errorDialog("You already own this book");
      return;
    }

    try {
      await call("insertBook", book);
      successDialog("Book is successfully added to your virtual shelf", 1);
      setOpenBook(null);
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    }
  };

  const handleFormChange = (field, value, authorIndex) => {
    const newformValues = {
      ...formValues,
    };
    newformValues[field] = value;
    setFormValues(newformValues);
  };

  const handleAddAuthor = () => {
    const nthAuthor = formValues.numberOfAuthors + 1;
    const newformValues = {
      ...formValues,
      numberOfAuthors: nthAuthor,
    };
    newformValues["author" + nthAuthor.toString()] = "";
    setFormValues(newformValues);
  };

  const handleRemoveAuthor = () => {
    const nthAuthor = formValues.numberOfAuthors - 1;
    const newformValues = {
      ...formValues,
      numberOfAuthors: nthAuthor,
    };
    delete newformValues["author" + formValues.numberOfAuthors.toString()];
    setFormValues(newformValues);
  };

  const handleImagePick = (images, type, index) => {
    if (type === "remove") {
      setBookImage(null);
      setIsUnsavedImageChange(true);
      return;
    }
    setBookImage(images[0]);
    setIsUnsavedImageChange(true);
  };

  const uploadBookImage = async () => {
    setIsSaving(true);

    try {
      const resizedImage = await resizeImage(bookImage.file, 400);
      const uploadedImage = await uploadImage(resizedImage, "bookImageUpload");
      const newUploadedBookImage = {
        name: bookImage.file.name,
        url: uploadedImage,
        uploadDate: new Date(),
      };
      setUploadedBookImage(newUploadedBookImage);
    } catch (error) {
      setIsSaving(false);
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const insertBookManually = async () => {
    if (!uploadedBookImage) {
      errorDialog("Please add image");
    }

    if (alreadyOwnsBook(formValues)) {
      errorDialog("You already own this book");
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
      await call("insertBookManually", book);
      successDialog("Book is successfully added to your virtual shelf", 1);
      this.setState({
        formValues: formValuesModel,
        bookImage: null,
        uploadedBookImage: null,
        unSavedImageChange: false,
        isManuallyAddModalOpen: false,
        isSaving: false,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    } finally {
      setFormValues(formValuesModel);
      setBookImage(null);
      setUploadedBookImage(null);
      setIsUnsavedImageChange(false);
      setIsManuallyAddModalOpen(false);
      setIsSaving(false);
    }
  };

  const alreadyOwnsBook = (book) => {
    return false;
    // return Books.findOne({
    //   title: book.title,
    //   ownerId: currentUser._id,
    // });
  };

  const closeModal = () => {
    setOpenBook(null);
    autoFocusSearchBar();
  };

  if (!currentUser) {
    return null;
    // <ActivityIndicator toast text="Loading..." />;
  }

  return (
    <div>
      <NavBar
        mode="light"
        leftContent={<Icon type="left" />}
        onBack={() => navigate("/")}
      >
        Add book to your shelf
      </NavBar>
      <Box p="4">
        <SearchBar
          placeholder="title, author, ISBN etc"
          value={searchbarInput}
          onChange={(value) => setSearchbarInput(value)}
          onSearch={() => searchbarSearch()}
          cancelText="Cancel"
          ref={searchbar}
        />
      </Box>

      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          {/* <ActivityIndicator text="Loading..." /> */}
        </div>
      )}

      <div style={{ paddingTop: 24 }}>
        {searchResults &&
          searchResults.map((result, index) => (
            <FadeInUp key={result.id} duration=".5s" timingFunction="ease">
              <BookCardNext
                isDark
                volumeInfo={result.volumeInfo}
                onClickBook={() => handleToggleBook(index)}
                isOpen={openBook === index}
                buttonText="Add to My Shelf"
                onButtonClick={() => insertBook(result.volumeInfo)}
              />
            </FadeInUp>
          ))}
      </div>

      <Flex justify="center">
        <Button onClick={() => setIsManuallyAddModalOpen(true)}>
          Manually Add Book
        </Button>
      </Flex>

      <Popup
        closable
        bodyStyle={{
          minHeight: "100vh",
          maxHeight: "100vh",
          overflow: "scroll",
          padding: 12,
        }}
        position="bottom"
        title="Manually Add Book"
        visible={isManuallyAddModalOpen}
        onClose={() => setIsManuallyAddModalOpen(false)}
      >
        <ManuallyAddBookForm
          values={formValues}
          bookImage={bookImage}
          isSaving={isSaving}
          onImagePick={handleImagePick}
          onFormChange={handleFormChange}
          onAddAuthor={handleAddAuthor}
          onRemoveAuthor={handleRemoveAuthor}
          onSave={uploadBookImage}
          onClose={() => setIsManuallyAddModalOpen(false)}
        />
      </Popup>
    </div>
  );
}

export default AddBook;
