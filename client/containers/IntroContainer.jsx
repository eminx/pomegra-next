import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import { Field, Control, Button } from 'bloomer';
import { ImagePicker, ActivityIndicator } from 'antd-mobile';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import HeroSlide from '../reusables/HeroSlide';
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
    introFinished: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    if (!prevProps.currentUser && currentUser) {
      this.goNext();
    }
  }

  handleSlideChange = index => {
    this.setState({
      carouselIndex: index
    });
  };

  isSliderDisabled = () => {
    const { carouselIndex } = this.state;
    if ([6, 7, 8].includes(carouselIndex)) return true;
    if ([0, 1, 2].includes(carouselIndex)) return false;
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
    this.props.createAccount(values);
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
        // successDialog('Values are successfu');
        this.goNext();
        return;
      }
    });
  };

  handleAvatarPick = (images, type, index) => {
    this.setState({
      avatar: images[0]
    });
  };

  handleCoverPick = (images, type, index) => {
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
      isSearching: true,
      searchResults: []
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

  openBook = index => {
    this.setState(({ openBook }) => {
      if (openBook === index) {
        return { openBook: null };
      } else {
        return { openBook: index };
      }
    });
  };

  insertBook = book => {
    const { insertedBooks } = this.state;

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

      successDialog('Book is successfully added to your virtual shelf');
      this.setState({
        searchValue: '',
        searchResults: null,
        openBook: null,
        insertedBooks: this.state.insertedBooks + 1
      });

      if (insertedBooks === 3) {
        Meteor.call('setIntroDone', (error, respond) => {
          if (error) {
            console.log(error);
          }
        });
      }
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
      introFinished
    } = this.state;

    if (introFinished) {
      return <Redirect to="/" />;
    }

    const isEmailInvalid = this.isEmailInvalid();
    const isUsernameInvalid = this.isUsernameInvalid();
    const isPasswordInvalid = this.isPasswordInvalid();

    return (
      <Slider
        ref={component => (this.slider = component)}
        arrows={![0, 1, 2].includes(carouselIndex)}
        dots={![0, 1, 2].includes(carouselIndex)}
        afterChange={this.handleSlideChange}
        // swipe={!this.isSliderDisabled()}
        infinite={false}
        adaptiveHeight
        initialSlide={0}
      >
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
          />
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
            onButtonClick={this.saveInfo}
          />
        )}

        <HeroSlide
          subtitle="Great! Now let's get avatar for you"
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
                {savingAvatar ? 'Saving Avatar...' : 'Save Avatar'}
                <ActivityIndicator animating={savingAvatar} />
              </Button>
            </Control>
          </Field>
        </HeroSlide>

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
                {savingCover ? 'Saving cover image...' : 'Save Cover Image'}
                <ActivityIndicator animating={savingCover} />
              </Button>
            </Control>
          </Field>
        </HeroSlide>

        <ProfileView currentUser={currentUser} onButtonClick={this.goNext} />

        <BookInserter
          isSearching={isSearching}
          openBook={openBook}
          insertedBooks={insertedBooks}
          searchResults={searchResults}
          searchValue={searchValue}
          onSearch={this.searchBook}
          onClickBook={this.openBook}
          onButtonClick={this.finishIntro}
          onSearchValueChange={event =>
            this.setState({ searchValue: event.target.value })
          }
        />
      </Slider>
    );
  }
}

export default IntroContainer = withTracker(props => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const isLoading = !currentUserSub.ready();

  return {
    currentUser,
    isLoading
  };
})(Intro);
