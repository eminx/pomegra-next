import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Field, Control, Button, Subtitle } from 'bloomer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FadeInUp } from 'animate-components';
import { shallowEqualArrays } from 'shallow-equal';
import { Center, Flex } from '@chakra-ui/react';

import HeroSlide from '../components/HeroSlide';
import LoginForm from '../components/LoginForm';
import FilePicker from '../components/FilePicker';

import allLanguages from '../../api/_utils/langs/allLanguages';

import {
  resizeImage,
  uploadImage,
  errorDialog,
  successDialog,
  validateEmail,
  call,
} from '../../api/_utils/functions';

import {
  InfoForm,
  EmailSlide,
  UsernameSlide,
  PasswordSlide,
  ProfileView,
  LanguageSelector,
  BookInserter,
  introSlides,
  googleApi,
} from '../layouts/hero';
import NiceShelf from '../components/NiceShelf';

const regexUsername = /[^a-z0-9]+/g;

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
    image: {
      uploadableImageLocal: null,
      uploadableImage: null,
    },
    savingAvatar: false,
    savingCover: false,
    searchValue: '',
    searchResults: null,
    isSearching: false,
    openBook: null,
    insertedBooks: 0,
    introFinished: false,
    forgotPassword: false,
    isLogin: false,
    gettingLocation: false,
  };

  componentDidMount() {
    setTimeout(() => this.goNext(), 3000);
    this.fillInfoForm();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;

    if (!prevProps.currentUser && currentUser) {
      this.fillInfoForm();
    }
  }

  fillInfoForm = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }

    this.setState({
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      bio: currentUser.bio || '',
      languages: currentUser.languages || [],
      avatar: currentUser.images && currentUser.images[0],
    });
  };

  handleSlideChange = (index) => {
    this.setState({
      carouselIndex: index,
    });
  };

  isSliderDisabled = () => {
    return false;
    const { carouselIndex } = this.state;
    // if ([].includes(carouselIndex)) return true;
    if ([0, 1, 2, 3, 7, 8, 9].includes(carouselIndex)) return false;
    return this.isEmailInvalid() || this.isUsernameInvalid() || this.isPasswordInvalid();
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
    if (username.length < 4) {
      return true;
    } else if (regexUsername.test(username)) {
      return true;
    }
    return false;
  };

  isPasswordInvalid = () => {
    const { password } = this.state;
    return password.length < 6;
  };

  handleEmailButtonClick = async () => {
    const { email } = this.state;
    const isEmailRegistered = await call('isEmailRegistered', email);
    if (isEmailRegistered) {
      errorDialog(
        `The email address ${email} is already registered for an account. Please log in if it's you`
      );
      return;
    }
    this.goNext();
  };

  handleUsernameButtonClick = async () => {
    const { username } = this.state;
    const isUsernameTaken = await call('isUsernameTaken', username);
    if (isUsernameTaken) {
      errorDialog(`Username ${username} is already taken. Please try another`);
      return;
    }
    this.goNext();
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
        console.log(error);
        errorDialog(error.reason);
        return;
      } else {
        this.setState({ isLogin: false, isLoading: false });
        successDialog('Successfullt logged in');
        this.slider.slickGoTo(1, true);
      }
    });
  };

  forgotPassword = () => {
    this.setState({
      forgotPassword: true,
    });
  };

  handleLanguageSelect = (event) => {
    const { languages } = this.state;
    const selectedLanguageValue = event.target.value;
    if (languages.some((language) => language.value === selectedLanguageValue)) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      (language) => language && language.value === selectedLanguageValue
    );
    const newLanguages = [...languages, selectedLanguage];
    this.setState({
      languages: newLanguages,
    });
  };

  handleRemoveLanguage = (language) => {
    const { languages } = this.state;
    const languageValue = language.value;

    const newLanguages = languages.filter((language) => languageValue !== language.value);
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
      successDialog('Your profile is successfully updated');
      this.goNext();
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error('Please select only one file');
      return;
    }

    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        const image = {
          uploadableImage,
          uploadableImageLocal: reader.result,
        };
        this.setState({ image });
      },
      false
    );
  };

  handleUploadImage = async () => {
    const { avatar, image } = this.state;

    if (avatar && !image.uploadableImage) {
      this.goNext();
      return;
    }

    this.setState({
      savingAvatar: true,
    });

    const { uploadableImage } = this.state.image;
    try {
      const resizedImage = await resizeImage(uploadableImage, 600);
      const uploadedImage = await uploadImage(resizedImage, 'profileImageUpload');
      await call('setProfileImage', uploadedImage);
      successDialog('Your new image is set');
    } catch (error) {
      console.log('Error uploading:', error);
      errorDialog(error.reason);
    } finally {
      this.setState({
        savingAvatar: false,
      });
      this.goNext();
    }
  };

  handleCoverPick = (pickedImages, type, index) => {
    const { coverImages } = this.state;
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
      coverImages: coverImages.filter((image, index) => imageIndex !== index),
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
    try {
      await call('insertBook', book);
      successDialog('Book is successfully added to your virtual shelf');
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
      this.goNext();
    }
  };

  getGeoLocation = () => {
    this.setState({ gettingLocation: true });
    const geolocation = navigator.geolocation;
    geolocation &&
      geolocation.getCurrentPosition((position) => {
        const coords = {
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          accuracy: position.coords.accuracy.toString(),
        };
        this.setGeoLocationCoords(coords);
      });
  };

  setGeoLocationCoords = async (coords) => {
    try {
      await call('setGeoLocationCoords', coords);
      successDialog('Your location is successfully set');
      this.goNext();
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  finishIntro = async () => {
    await call('setIntroDone');
  };

  render() {
    const { currentUser } = this.props;
    const {
      email,
      avatar,
      username,
      password,
      firstName,
      lastName,
      bio,
      languages,
      savingAvatar,
      image,
      searchValue,
      searchResults,
      isSearching,
      openBook,
      insertedBooks,
      introFinished,
      forgotPassword,
      isLogin,
      gettingLocation,
    } = this.state;

    if (introFinished) {
      return <Redirect to="/" />;
    } else if (forgotPassword) {
      return <Redirect to="/forgot-password" />;
    }

    if (currentUser && currentUser.isIntroDone) {
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
        currentUser.languages.map((lang) => lang.value)
      );
    }

    const profileUnchanged = areProfileFieldsUnChanged && isLanguageUnChangedForExistingUser;

    const sliderProps = {
      ref: (component) => (this.slider = component),
      arrows: false,
      dots: false,
      afterChange: this.handleSlideChange,
      swipe: false,
      infinite: false,
      adaptiveHeight: true,
      className: 'intro-slider',
      onTouchEnd: swipeAction,
      onTouchMove: swipeAction,
      onTouchStart: swipeAction,
    };

    if (!currentUser) {
      return (
        <Slider {...sliderProps}>
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

          {introSlides.map((slide) => (
            <HeroSlide
              key={slide.title}
              isColor={slide.color}
              title={slide.title}
              subtitle={slide.subtitle}
              goNext={this.goNext}
            />
          ))}
          <EmailSlide
            email={email}
            onChange={(event) => this.setState({ email: event.target.value })}
            isEmailInvalid={isEmailInvalid}
            onButtonClick={this.handleEmailButtonClick}
            initLogin={() => this.setState({ isLogin: true })}
          >
            {isLogin && (
              <FadeInUp duration=".5s" timingFunction="ease">
                <LoginForm
                  username={username}
                  password={password}
                  onUsernameChange={(value) => this.setState({ username: value })}
                  onPasswordChange={(value) => this.setState({ password: value })}
                  onButtonClick={() => this.signIn()}
                  onSecondaryButtonClick={this.forgotPassword}
                  closeLogin={() => this.setState({ isLogin: false })}
                />
              </FadeInUp>
            )}
          </EmailSlide>

          <UsernameSlide
            username={username}
            onChange={(event) => this.setState({ username: event.target.value })}
            isUsernameInvalid={isUsernameInvalid}
            onButtonClick={this.handleUsernameButtonClick}
          />

          <PasswordSlide
            password={password}
            onChange={(event) => this.setState({ password: event.target.value })}
            isPasswordInvalid={isPasswordInvalid}
            onButtonClick={this.handleCreateAccount}
          />
        </Slider>
      );
    }

    return (
      <Slider {...sliderProps}>
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

        <InfoForm
          bio={bio}
          firstName={firstName}
          lastName={lastName}
          onFirstNameChange={(e) => this.setState({ firstName: e.target.value })}
          onLastNameChange={(e) => this.setState({ lastName: e.target.value })}
          onBioChange={(e) => this.setState({ bio: e.target.value })}
          onSubmitInfoForm={this.goNext}
        />

        <LanguageSelector
          languages={languages}
          profileUnchanged={profileUnchanged}
          onLanguageSelect={this.handleLanguageSelect}
          onDeleteClick={(language) => this.handleRemoveLanguage(language)}
          onButtonClick={this.saveInfo}
          onSkip={() => this.goNext()}
        />

        <HeroSlide isColor="dark" isSkip subtitle="Great! Now let's get an avatar for you">
          <Field>
            <Center mb="8">
              <FilePicker
                imageUrl={avatar}
                height="120px"
                width="120px"
                uploadableImageLocal={image?.uploadableImageLocal}
                setUploadableImage={this.setUploadableImage}
              />
            </Center>

            <Control style={{ paddingTop: 24 }}>
              <Button
                disabled={(!image.uploadableImage && !avatar) || savingAvatar}
                onClick={this.handleUploadImage}
                className="is-rounded"
                isPulled="right"
              >
                {avatar ? 'Continue' : savingAvatar ? 'Saving Avatar... ' : 'Save Avatar'}
              </Button>
            </Control>
          </Field>
        </HeroSlide>

        {/* <HeroSlide subtitle="Awesome! Now let's set some cover images" isColor="dark">
          <Field>
            <ImageUploader
              value={
                currentUser.coverImages
                  ? currentUser.coverImages.map((image) => ({
                      url: image,
                    }))
                  : coverImages
              }
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
                {currentUser.coverImages ? 'Continue' : savingCover ? 'Saving... ' : 'Save'}
              </Button>
            </Control>
          </Field>
        </HeroSlide> */}

        <ProfileView currentUser={currentUser} onButtonClick={this.goNext} />

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
          onSearchValueChange={(event) => this.setState({ searchValue: event.target.value })}
        />

        <HeroSlide
          subtitle="Almost there! We only need to set your location so that we could show you nearby books"
          isColor="dark"
        >
          <Subtitle isSize={6}>
            Your location will never be shared publicly, or with third parties.
          </Subtitle>

          <Button
            onClick={this.getGeoLocation}
            hasTextAlign="centered"
            isLoading={gettingLocation}
            isPulled="centered"
          >
            Set Your Location
          </Button>

          <Subtitle isSize={6}>
            After clicking, you will be prompted by your device to ask for permission
          </Subtitle>
        </HeroSlide>

        <HeroSlide subtitle="Congratulations!" isColor="success">
          <Subtitle isSize={4}>Now you are ready to start lending and borrowing books</Subtitle>

          <Button
            isColor="light"
            isInverted
            isOutlined
            className="is-rounded"
            onClick={this.finishIntro}
            isPulled="right"
          >
            Get Started
          </Button>
        </HeroSlide>
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
    if (screenX > startX + threshold || screenX < startX - threshold) {
      // moved more than 20px left or right
      document.body.classList.add('prevent-scroll');
    }
  } else if (type === 'touchend') {
    document.body.classList.remove('prevent-scroll');
    startX = 0;
  }
};

export default IntroContainer = withTracker((props) => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  return {
    currentUser,
  };
})(Intro);
