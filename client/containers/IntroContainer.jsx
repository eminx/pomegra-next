import { Meteor } from 'meteor/meteor';
import React, { PureComponent, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import { Field, Control, Image, Button } from 'bloomer';
import { ImagePicker, ActivityIndicator, Flex } from 'antd-mobile';
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
  dataURLtoFile,
  errorDialog,
  successDialog,
  validateEmail
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
  googleApi
} from './HeroHelpers/';
import NiceShelf from '../reusables/NiceShelf';

class Intro extends PureComponent {
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
    cover: null,
    savingAvatar: false,
    savingCover: false,
    searchValue: '',
    searchResults: null,
    isSearching: false,
    openBook: null,
    insertedBooks: 0,
    introFinished: false,
    isLogin: false
  };

  componentDidMount() {
    setTimeout(() => this.goNext(), 3000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    const { carouselIndex } = this.state;

    if (!prevProps.currentUser && currentUser) {
      this.setState({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || '',
        languages: currentUser.languages || []
      });

      if (
        currentUser &&
        currentUser.isIntroDone &&
        [0, 1, 2, 3, 4].includes(carouselIndex)
      ) {
        this.setState({ introFinished: true });
      }
    }
  }

  handleSlideChange = index => {
    this.setState({
      carouselIndex: index
    });
  };

  isSliderDisabled = () => {
    const { carouselIndex } = this.state;
    if ([7, 8, 9].includes(carouselIndex)) return true;
    if ([0, 1, 2, 3].includes(carouselIndex)) return false;
    return (
      this.isEmailInvalid() ||
      this.isUsernameInvalid() ||
      this.isPasswordInvalid()
    );
  };

  goNext = () => {
    this.slider.slickNext();
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

  handleCreateAccount = () => {
    const { email, username, password } = this.state;
    const values = {
      email,
      username,
      password
    };
    this.setState({ isLoading: true });

    Meteor.call('registerUser', values, (error, respond) => {
      if (error) {
        console.log('error!!');
        console.log(error);
        errorDialog(error.reason);
        this.setState({ isLoading: false });
        return;
      }
      successDialog('Your account is successfully created');
      this.signIn();
      this.setState({
        isLoading: false
      });
    });
  };

  signIn = () => {
    const { username, password } = this.state;
    Meteor.loginWithPassword(username, password, error => {
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

  handleLanguageSelect = event => {
    const { languages } = this.state;
    const selectedLanguageValue = event.target.value;

    if (languages.some(language => language.value === selectedLanguageValue)) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      language => language && language.value === selectedLanguageValue
    );

    const newLanguages = [...languages, selectedLanguage];
    this.setState({
      languages: newLanguages
    });
  };

  handleRemoveLanguage = language => {
    const { languages } = this.state;
    const languageValue = language.value;

    const newLanguages = languages.filter(
      language => languageValue !== language.value
    );
    this.setState({
      languages: newLanguages
    });
  };

  saveInfo = () => {
    const { firstName, lastName, bio, languages } = this.state;
    const values = {
      firstName,
      lastName,
      bio
    };

    Meteor.call('updateProfile', values, languages, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
      } else {
        successDialog('Your profile is successfully updated', 1);
        this.goNext();
      }
    });
  };

  handleAvatarPick = (images, type, index) => {
    if (type === 'delete') {
      this.setState({
        cover: null
      });
      return;
    }
    this.setState({
      avatar: images[0]
    });
  };

  handleCoverPick = (images, type, index) => {
    if (type === 'delete') {
      this.setState({
        cover: null
      });
      return;
    }
    this.setState({
      cover: images[0]
    });
  };

  saveAvatar = () => {
    const { avatar } = this.state;

    this.setState({
      savingAvatar: true
    });

    resizeImage(avatar, 180, uri => {
      const uploadableImage = dataURLtoFile(uri, avatar.file.name);
      uploadProfileImage(uploadableImage, (error, respond) => {
        if (error) {
          console.log('error!', error);
          errorDialog(error.reason);
          return;
        }
        const avatarToSave = {
          name: avatar.file.name,
          url: respond,
          uploadDate: new Date()
        };
        Meteor.call('setNewAvatar', avatarToSave, (error, respond) => {
          if (error) {
            console.log(error);
            errorDialog(error.reason);
            return;
          }
          this.setState({
            savingAvatar: false
          });
          this.goNext();
        });
      });
    });
  };

  saveCover = () => {
    const { cover } = this.state;

    this.setState({
      savingCover: true
    });

    resizeImage(cover, 600, uri => {
      const uploadableImage = dataURLtoFile(uri, cover.file.name);
      uploadProfileImage(uploadableImage, (error, respond) => {
        if (error) {
          console.log('error!', error);
          errorDialog(error.reason);
          return;
        }
        const coverToSave = {
          name: cover.file.name,
          url: respond,
          uploadDate: new Date()
        };
        Meteor.call('setNewCoverImages', [coverToSave], (error, respond) => {
          if (error) {
            console.log(error);
            errorDialog(error.reason);
            this.setState({ savingCover: false });
            return;
          }
          this.setState({
            savingCover: false
          });
          this.goNext();
        });
      });
    });
  };

  searchBook = event => {
    event && event.preventDefault();
    const { searchValue } = this.state;

    this.setState({
      isSearching: true
    });

    fetch(googleApi + searchValue)
      .then(results => {
        return results.json();
      })
      .then(parsedResults => {
        this.setState({
          isSearching: false,
          searchResults: parsedResults.items
        });
      });
  };

  handleToggleBook = index => {
    this.setState(({ openBook }) => {
      if (openBook === index) {
        return { openBook: null };
      } else {
        return { openBook: index };
      }
    });
  };

  insertBook = book => {
    const { insertedBooks, searchResults } = this.state;

    Meteor.call('insertBook', book, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
        return;
      } else if (respond && respond.error) {
        console.log(respond.error);
        errorDialog(respond.error);
        return;
      }

      if (insertedBooks === 2) {
        Meteor.call('setIntroDone', (error, respond) => {
          if (error) {
            console.log(error);
          }
        });
      }

      successDialog('Book is successfully added to your virtual shelf', 1);
      this.setState({
        searchValue: '',
        openBook: null,
        insertedBooks: insertedBooks + 1,
        searchResults: insertedBooks === 2 ? [] : searchResults
      });
    });
  };

  finishIntro = () => {
    this.setState({
      introFinished: true
    });
  };

  render() {
    const { currentUser } = this.props;
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
      cover,
      savingCover,
      searchValue,
      searchResults,
      isSearching,
      openBook,
      insertedBooks,
      introFinished,
      isLogin
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
        languages.map(lang => lang.value),
        currentUser.languages.map(lang => lang.value)
      );
    }

    const profileUnchanged =
      areProfileFieldsUnChanged && isLanguageUnChangedForExistingUser;

    return (
      <Slider
        ref={component => (this.slider = component)}
        arrows={![0, 1, 2].includes(carouselIndex)}
        dots={![0, 1, 2].includes(carouselIndex)}
        afterChange={this.handleSlideChange}
        swipe={!this.isSliderDisabled()}
        infinite={false}
        adaptiveHeight
        initialSlide={0}
        className="custom-slider"
        onTouchEnd={swipeAction}
        onTouchMove={swipeAction}
        onTouchStart={swipeAction}
      >
        <HeroSlide>
          <Flex justify="center" style={{ height: '100vh', paddingTop: 80 }}>
            <Flex align="center" direction="column">
              <NiceShelf width={192} height={192} color="#3e3e3e" />
            </Flex>
          </Flex>
        </HeroSlide>

        {introSlides.map(slide => (
          <HeroSlide
            key={slide.title}
            isColor={slide.color}
            title={slide.title}
            subtitle={slide.subtitle}
          />
        ))}
        {!currentUser && (
          <EmailSlide
            email={email}
            onChange={event => this.setState({ email: event.target.value })}
            isEmailInvalid={isEmailInvalid}
            onButtonClick={this.goNext}
            initLogin={() => this.setState({ isLogin: true })}
          >
            {isLogin && (
              <FadeInUp duration=".5s" timingFunction="ease">
                <LoginForm
                  username={username}
                  password={password}
                  onUsernameChange={value => this.setState({ username: value })}
                  onPasswordChange={value => this.setState({ password: value })}
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
            onChange={event => this.setState({ username: event.target.value })}
            isUsernameInvalid={isUsernameInvalid}
            onButtonClick={this.goNext}
          />
        )}
        {!currentUser && (
          <PasswordSlide
            password={password}
            onChange={event => this.setState({ password: event.target.value })}
            isPasswordInvalid={isPasswordInvalid}
            onButtonClick={this.handleCreateAccount}
          />
        )}
        {currentUser && (
          <InfoForm
            firstName={firstName}
            lastName={lastName}
            bio={bio}
            onFirstNameChange={e =>
              this.setState({ firstName: e.target.value })
            }
            onLastNameChange={e => this.setState({ lastName: e.target.value })}
            onBioChange={e => this.setState({ bio: e.target.value })}
            onSubmitInfoForm={this.goNext}
          />
        )}
        {currentUser && (
          <LanguageSelector
            languages={languages}
            onLanguageSelect={this.handleLanguageSelect}
            onDeleteClick={language => this.handleRemoveLanguage(language)}
            onButtonClick={profileUnchanged ? this.goNext : this.saveInfo}
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
        {currentUser &&
          (!currentUser.coverImages ||
            currentUser.coverImages.length === 0) && (
            <HeroSlide
              subtitle="Awesome! Now let's get a cover image"
              isColor="dark"
            >
              <Field>
                <div style={{ maxWidth: 160, margin: '0 auto' }}>
                  <ImagePicker
                    files={cover ? [cover] : []}
                    onChange={this.handleCoverPick}
                    selectable={!cover}
                    accept="image/jpeg,image/jpg,image/png"
                    multiple={false}
                    length={1}
                  />
                </div>

                <Control style={{ paddingTop: 24 }}>
                  <Button
                    disabled={!cover || savingCover}
                    onClick={this.saveCover}
                    className="is-rounded"
                    isPulled="right"
                  >
                    {savingCover
                      ? 'Saving cover image... '
                      : 'Save Cover Image'}
                    <ActivityIndicator animating={savingCover} />
                  </Button>
                </Control>
              </Field>
            </HeroSlide>
          )}
        {currentUser && (
          <ProfileView currentUser={currentUser} onButtonClick={this.goNext} />
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
            onSearchValueChange={event =>
              this.setState({ searchValue: event.target.value })
            }
          />
        )}
      </Slider>
    );
  }
}

let startX = 0;

const swipeAction = event => {
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

export default IntroContainer = withTracker(props => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const isLoading = !currentUserSub.ready();

  return {
    currentUser,
    isLoading
  };
})(Intro);
