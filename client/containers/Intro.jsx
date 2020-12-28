import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Field, Control, Button } from 'bloomer';
import {
  ImagePicker,
  ActivityIndicator,
  Flex,
  Carousel,
} from 'antd-mobile';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FadeInUp } from 'animate-components';
import { shallowEqualArrays } from 'shallow-equal';

import HeroSlide from '../reusables/HeroSlide';
import LoginForm from '../reusables/LoginForm';
import allLanguages from '../allLanguages';

import {
  resizeImage,
  uploadImage,
  dataURLtoFile,
  errorDialog,
  successDialog,
  validateEmail,
  call,
} from '../functions';

import {
  InfoForm,
  EmailSlide,
  UsernameSlide,
  PasswordSlide,
  ProfileView,
  LanguageSelector,
  BookInserter,
  introSlides,
  uploadProfileImage,
  googleApi,
} from './HeroHelpers';
import NiceShelf from '../reusables/NiceShelf';
import { UserContext } from './Layout';

const slideStyle = (backgroundImage) => ({
  width: '100%',
  height: '40vh',
  minHeight: 180,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  touchAction: 'none',
});

class Intro extends Component {
  state = {
    carouselIndex: 0,
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    bio: '',
    languages: [],
    avatar: null,
    coverImages: [],
    savingAvatar: false,
    savingCover: false,
    searchValue: '',
    searchResults: null,
    isSearching: false,
    openBook: null,
    insertedBooks: 0,
    introFinished: false,
    isLogin: false,
  };

  componentDidMount() {
    setTimeout(() => this.goNext(), 3000);
    this.fillInfoForm();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.context;

    // if (!prevProps.currentUser && currentUser) {
    //   this.fillInfoForm();
    // }
  }

  fillInfoForm = () => {
    const { currentUser } = this.context;
    const { carouselIndex } = this.state;
    if (!currentUser) {
      return;
    }

    this.setState({
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      bio: currentUser.bio || '',
      languages: currentUser.languages || [],
    });

    if (
      currentUser.isIntroDone &&
      [0, 1, 2, 3, 4].includes(carouselIndex)
    ) {
      this.setState({ introFinished: true });
    }
  };

  handleSlideChange = (index) => {
    this.setState({
      carouselIndex: index,
    });
  };

  isSliderDisabled = () => {
    const { carouselIndex } = this.state;
    // if ([].includes(carouselIndex)) return true;
    if ([0, 1, 2, 3, 7, 8, 9].includes(carouselIndex)) return false;
    return (
      this.isEmailInvalid() ||
      this.isUsernameInvalid() ||
      this.isPasswordInvalid()
    );
  };

  goNext = () => {
    this.slider && this.slider.slickNext();
  };

  isEmailInvalid = () => {
    const { email } = this.state;
    return !validateEmail(email);
  };

  isUsernameInvalid = () => {
    const { username } = this.state;
    return username.length < 6;
  };

  isPasswordInvalid = () => {
    const { password } = this.state;
    return password.length < 6;
  };

  handleCreateAccount = async () => {
    const { email, username, password } = this.state;
    const values = {
      email,
      username,
      password,
    };
    this.setState({ isLoading: true });

    try {
      await call('registerUser', values);
      successDialog('Your account is successfully created');
      this.signIn();
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  signIn = () => {
    const { username, password } = this.state;
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        errorDialog(error);
        console.log(error);
      }
      successDialog('You are successfully logged in');
      this.setState({ isLogin: false });
    });
  };

  forgotPassword = () => {
    alert('This is not implemented yet, try again later please');
  };

  handleLanguageSelect = (event) => {
    const { languages } = this.state;
    const selectedLanguageValue = event.target.value;
    if (
      languages.some(
        (language) => language.value === selectedLanguageValue,
      )
    ) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      (language) =>
        language && language.value === selectedLanguageValue,
    );
    const newLanguages = [...languages, selectedLanguage];
    this.setState({
      languages: newLanguages,
    });
  };

  handleRemoveLanguage = (language) => {
    const { languages } = this.state;
    const languageValue = language.value;

    const newLanguages = languages.filter(
      (language) => languageValue !== language.value,
    );
    this.setState({
      languages: newLanguages,
    });
  };

  saveInfo = async () => {
    const { firstName, lastName, bio, languages } = this.state;
    const values = {
      firstName,
      lastName,
      bio,
    };

    try {
      await call('updateProfile', values, languages);
      successDialog('Your profile is successfully updated', 1);
      this.goNext();
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  handleAvatarPick = (images, type, index) => {
    if (type === 'remove') {
      this.setState({
        avatar: null,
      });
      return;
    }
    this.setState({
      avatar: images[0],
    });
  };

  saveAvatar = async () => {
    const { avatar } = this.state;

    this.setState({
      savingAvatar: true,
    });

    try {
      const resizedAvatar = await resizeImage(avatar.file, 300);
      const uploadedAvatar = await uploadImage(
        resizedAvatar,
        'profileImageUpload',
      );
      const avatarToSave = {
        name: avatar.file.name,
        url: uploadedAvatar,
        uploadDate: new Date(),
      };
      await call('setNewAvatar', avatarToSave);
      this.setState({
        isUploading: false,
      });
      this.goNext();
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    } finally {
      this.setState({
        savingAvatar: false,
      });
    }
  };

  handleCoverPick = (pickedImages, type, index) => {
    const { coverImages } = this.state;
    console.log(type);
    if (type === 'remove') {
      this.setState({
        coverImages: coverImages.filter((cover, i) => i !== index),
      });
      return;
    }

    this.setState({
      coverImages: [...coverImages, ...pickedImages],
    });
  };

  handleRemoveCover = (imageIndex) => {
    const { coverImages } = this.state;
    this.setState({
      coverImages: coverImages.filter(
        (image, index) => imageIndex !== index,
      ),
      unSavedImageChange: true,
      coverChange: true,
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ coverImages }) => ({
      coverImages: arrayMove(coverImages, oldIndex, newIndex),
      unSavedImageChange: true,
      coverChange: true,
    }));
  };

  saveCoverImages = async () => {
    this.setState({
      savingCover: true,
    });

    const { coverImages } = this.state;

    try {
      const imagesReadyToSave = await Promise.all(
        coverImages.map(async (cover, index) => {
          const resizedImage = await resizeImage(cover.file, 1200);
          const uploadedImage = await uploadImage(
            resizedImage,
            'coverUpload',
          );
          return uploadedImage;
        }),
      );
      await call('setNewCoverImages', imagesReadyToSave);
    } catch (error) {
      console.error('Error uploading:', error);
      errorDialog(error.reason);
    } finally {
      this.setState({
        savingCover: false,
      });
    }
  };

  searchBook = (event) => {
    event && event.preventDefault();
    const { searchValue } = this.state;

    this.setState({
      isSearching: true,
    });

    fetch(googleApi + searchValue)
      .then((results) => {
        return results.json();
      })
      .then((parsedResults) => {
        this.setState({
          isSearching: false,
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
    const { insertedBooks, searchResults } = this.state;

    console.log(book);

    try {
      await ('insertBook', book);
      successDialog(
        'Book is successfully added to your virtual shelf',
        1,
      );
      this.setState({
        searchValue: '',
        openBook: null,
        insertedBooks: insertedBooks + 1,
        searchResults: insertedBooks === 2 ? [] : searchResults,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }

    if (insertedBooks >= 2) {
      await call('setIntroDone');
    }
  };

  finishIntro = () => {
    this.setState({
      introFinished: true,
    });
  };

  render() {
    const { currentUser } = this.context;
    const {
      carouselIndex,
      email,
      username,
      password,
      firstName,
      lastName,
      bio,
      languages,
      avatar,
      savingAvatar,
      coverImages,
      savingCover,
      searchValue,
      searchResults,
      isSearching,
      openBook,
      insertedBooks,
      introFinished,
      isLogin,
    } = this.state;

    if (introFinished) {
      return <Redirect to="/" />;
    }

    const isEmailInvalid = this.isEmailInvalid();
    const isUsernameInvalid = this.isUsernameInvalid();
    const isPasswordInvalid = this.isPasswordInvalid();

    let areProfileFieldsUnChanged;
    if (currentUser) {
      areProfileFieldsUnChanged =
        firstName === currentUser.firstName &&
        lastName === currentUser.lastName &&
        bio === currentUser.bio;
    }

    let isLanguageUnChangedForExistingUser;
    if (currentUser && currentUser.languages) {
      isLanguageUnChangedForExistingUser = shallowEqualArrays(
        languages.map((lang) => lang.value),
        currentUser.languages.map((lang) => lang.value),
      );
    }

    const profileUnchanged =
      areProfileFieldsUnChanged && isLanguageUnChangedForExistingUser;

    return (
      <Slider
        ref={(component) => (this.slider = component)}
        // arrows={![0, 1, 2].includes(carouselIndex)}
        // dots={![0, 1, 2].includes(carouselIndex)}
        afterChange={this.handleSlideChange}
        swipe={!this.isSliderDisabled()}
        infinite={false}
        adaptiveHeight
        initialSlide={currentUser ? 3 : 0}
        className="custom-slider"
        onTouchEnd={swipeAction}
        onTouchMove={swipeAction}
        onTouchStart={swipeAction}
      >
        <HeroSlide>
          <Flex justify="center" style={{ height: '100vh' }}>
            <Flex align="center" direction="column">
              <NiceShelf width={192} height={192} color="#3e3e3e" />
              <img
                src="https://pomegra-profile-images.s3.eu-central-1.amazonaws.com/LibrellaLogo.png"
                alt="Librella"
                width={210}
                height={45}
              />
            </Flex>
          </Flex>
        </HeroSlide>

        {!currentUser &&
          introSlides.map((slide) => (
            <HeroSlide
              key={slide.title}
              isColor={slide.color}
              title={slide.title}
              subtitle={slide.subtitle}
              goNext={this.goNext}
            />
          ))}
        {!currentUser && (
          <EmailSlide
            email={email}
            onChange={(event) =>
              this.setState({ email: event.target.value })
            }
            isEmailInvalid={isEmailInvalid}
            onButtonClick={this.goNext}
            initLogin={() => this.setState({ isLogin: true })}
          >
            {isLogin && (
              <FadeInUp duration=".5s" timingFunction="ease">
                <LoginForm
                  username={username}
                  password={password}
                  onUsernameChange={(value) =>
                    this.setState({ username: value })
                  }
                  onPasswordChange={(value) =>
                    this.setState({ password: value })
                  }
                  onButtonClick={() => this.signIn()}
                  onSecondaryButtonClick={this.forgotPassword}
                  closeLogin={() => this.setState({ isLogin: false })}
                />
              </FadeInUp>
            )}
          </EmailSlide>
        )}
        {!currentUser && (
          <UsernameSlide
            username={username}
            onChange={(event) =>
              this.setState({ username: event.target.value })
            }
            isUsernameInvalid={isUsernameInvalid}
            onButtonClick={this.goNext}
          />
        )}
        {!currentUser && (
          <PasswordSlide
            password={password}
            onChange={(event) =>
              this.setState({ password: event.target.value })
            }
            isPasswordInvalid={isPasswordInvalid}
            onButtonClick={this.handleCreateAccount}
          />
        )}
        {currentUser &&
          (!currentUser.firstName || !currentUser.lastName) && (
            <InfoForm
              firstName={firstName}
              lastName={lastName}
              bio={bio}
              onFirstNameChange={(e) =>
                this.setState({ firstName: e.target.value })
              }
              onLastNameChange={(e) =>
                this.setState({ lastName: e.target.value })
              }
              onBioChange={(e) =>
                this.setState({ bio: e.target.value })
              }
              onSubmitInfoForm={this.saveInfo}
            />
          )}
        {currentUser &&
          (!currentUser.languages ||
            currentUser.languages.length < 1) && (
            <LanguageSelector
              languages={languages}
              onLanguageSelect={this.handleLanguageSelect}
              onDeleteClick={(language) =>
                this.handleRemoveLanguage(language)
              }
              onButtonClick={
                profileUnchanged ? this.goNext : this.saveInfo
              }
              profileUnchanged={profileUnchanged}
            />
          )}
        {currentUser && !currentUser.avatar && (
          <HeroSlide
            subtitle="Great! Now let's get an avatar for you"
            isColor="dark"
          >
            <Field>
              <div style={{ maxWidth: 160, margin: '0 auto' }}>
                <ImagePicker
                  files={avatar ? [avatar] : []}
                  onChange={this.handleAvatarPick}
                  selectable={!avatar}
                  accept="image/jpeg,image/jpg,image/png"
                  multiple={false}
                  length={1}
                />
              </div>

              <Control style={{ paddingTop: 24 }}>
                <Button
                  disabled={!avatar || savingAvatar}
                  onClick={this.saveAvatar}
                  className="is-rounded"
                  isPulled="right"
                >
                  {savingAvatar ? 'Saving Avatar... ' : 'Save Avatar'}
                  <ActivityIndicator animating={savingAvatar} />
                </Button>
              </Control>
            </Field>
          </HeroSlide>
        )}
        {currentUser && !currentUser.coverImages && (
          <HeroSlide
            subtitle="Awesome! Now let's set some cover images"
            isColor="dark"
          >
            {/* {currentUser.coverImages && (
              <Carousel autoplay infinite style={{ minHeight: 180 }}>
                
              </Carousel>
            */}
            <Field>
              <ImagePicker
                files={coverImages}
                onChange={this.handleCoverPick}
                selectable
                accept="image/jpeg,image/jpg,image/png"
                multiple
                length={3}
              />

              <Control style={{ paddingTop: 24 }}>
                <Button
                  disabled={coverImages.length === 0 || savingCover}
                  onClick={this.saveCoverImages}
                  className="is-rounded"
                  isPulled="right"
                >
                  {savingCover ? 'Saving... ' : 'Save'}
                  <ActivityIndicator animating={savingCover} />
                </Button>
              </Control>
            </Field>
          </HeroSlide>
        )}
        {currentUser && (
          <ProfileView
            currentUser={currentUser}
            onButtonClick={this.goNext}
          />
        )}
        {currentUser && (
          <BookInserter
            isSearching={isSearching}
            onClickBook={this.handleToggleBook}
            insertedBooks={insertedBooks}
            searchResults={searchResults}
            searchValue={searchValue}
            onSearch={this.searchBook}
            openBook={openBook}
            onButtonClick={() => this.finishIntro()}
            onAddButtonClick={this.insertBook}
            onSearchValueChange={(event) =>
              this.setState({ searchValue: event.target.value })
            }
          />
        )}
      </Slider>
    );
  }
}

let startX = 0;

const swipeAction = (event) => {
  const { type } = event;
  const { screenX } = event.changedTouches[0];
  const threshold = 20;

  if (type === 'touchstart') {
    startX = screenX;
  } else if (type === 'touchmove') {
    if (
      screenX > startX + threshold ||
      screenX < startX - threshold
    ) {
      // moved more than 20px left or right
      document.body.classList.add('prevent-scroll');
    }
  } else if (type === 'touchend') {
    document.body.classList.remove('prevent-scroll');
    startX = 0;
  }
};

Intro.contextType = UserContext;

export default Intro;
