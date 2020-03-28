import React, { Component, PureComponent, Fragment } from 'react';
import {
  Hero,
  HeroBody,
  HeroFooter,
  Container,
  Title,
  Button,
  Subtitle,
  Field,
  Control,
  Input,
  TextArea,
  Help,
  Label,
  Select,
  Notification,
  Tag,
  Delete
} from 'bloomer';
import { Flex } from 'antd-mobile';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import allLanguages from '../allLanguages';

const introSlides = [
  {
    title: 'Virtualise your library',
    subtitle:
      'get to see the books people have in short distance to you, and borrow',
    color: 'info'
  },
  {
    title: 'Inspire and Discover Books',
    subtitle:
      'get to see the books people have in short distance to you, and borrow',
    color: 'primary'
  },
  {
    title: 'Let People Read More',
    subtitle:
      'get borrow requests from interesting readers in your city, become a librarian',
    color: 'success'
  }
];

const HeroSlide = ({ title, subtitle, color, children }) => (
  <Hero isFullHeight isBold isColor={color} isPaddingless={false}>
    <HeroBody>
      <Container>
        {title && <Title isSize={2}>{title}</Title>}
        {subtitle && <Subtitle isSize={4}> {subtitle}</Subtitle>}
        {children}
      </Container>
    </HeroBody>
  </Hero>
);

class Splash extends PureComponent {
  state = {
    carouselIndex: 0,
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    bio: '',
    languages: []
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

  handleInfoFormSubmit = form => {};

  handleLanguageSelect = event => {
    const { languages } = this.state;
    const selectedLanguageValue = event.target.value;

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
      languages
    } = this.state;

    const isEmailInvalid = this.isEmailInvalid();
    const isUsernameInvalid = this.isUsernameInvalid();
    const isPasswordInvalid = this.isPasswordInvalid();

    return (
      <Slider
        ref={component => (this.slider = component)}
        arrows={![0, 1, 2].includes(carouselIndex)}
        dots={![0, 1, 2].includes(carouselIndex)}
        afterChange={this.handleSlideChange}
        swipe={!this.isSliderDisabled()}
        infinite={false}
      >
        {introSlides.map(slide => (
          <HeroSlide
            key={slide.title}
            color={slide.color}
            title={slide.title}
            subtitle={slide.subtitle}
          ></HeroSlide>
        ))}

        {!currentUser && (
          <HeroSlide subtitle="Enter your private email address" color="dark">
            <Fragment>
              <Field>
                <Control>
                  <Input
                    type="email"
                    placeholder="email address"
                    value={email}
                    onChange={event =>
                      this.setState({ email: event.target.value })
                    }
                    isSize="large"
                    className="is-rounded"
                    style={{ color: '#3e3e3e' }}
                    isColor={
                      email.length === 0
                        ? 'info'
                        : isEmailInvalid
                        ? 'warning'
                        : 'success'
                    }
                  />
                </Control>
              </Field>

              <Button
                disabled={isEmailInvalid}
                onClick={this.goNext}
                className="is-rounded"
                isPulled="right"
              >
                Next
              </Button>
            </Fragment>
          </HeroSlide>
        )}

        {!currentUser && (
          <HeroSlide subtitle="Create a username" color="dark">
            <Fragment>
              <Field>
                <Control>
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={event =>
                      this.setState({ username: event.target.value })
                    }
                    isSize="large"
                    className="is-rounded"
                    style={{ color: '#3e3e3e' }}
                    isColor={
                      username.length === 0
                        ? 'info'
                        : isUsernameInvalid
                        ? 'warning'
                        : 'success'
                    }
                  />
                </Control>
                <Help
                  isColor={
                    username.length === 0
                      ? 'info'
                      : isUsernameInvalid
                      ? 'warning'
                      : 'success'
                  }
                >
                  {username.length === 0
                    ? null
                    : isUsernameInvalid
                    ? 'username is not available'
                    : 'username is available'}
                </Help>
              </Field>

              <Button
                disabled={isUsernameInvalid}
                onClick={this.goNext}
                className="is-rounded"
                isPulled="right"
              >
                Next
              </Button>
            </Fragment>
          </HeroSlide>
        )}

        {!currentUser && (
          <HeroSlide subtitle="Create a password" color="dark">
            <Fragment>
              <Field>
                <Control>
                  <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={event =>
                      this.setState({ password: event.target.value })
                    }
                    isSize="large"
                    className="is-rounded"
                    style={{ color: '#3e3e3e' }}
                    isColor={
                      password.length === 0
                        ? 'info'
                        : isUsernameInvalid
                        ? 'warning'
                        : 'success'
                    }
                  />
                </Control>
                <Help isColor={isPasswordInvalid ? 'warning' : 'success'}>
                  {isPasswordInvalid ? 'not strong enought' : 'looks great'}
                </Help>
              </Field>
              <Button
                disabled={isPasswordInvalid}
                onClick={this.handleCreateAccount}
                className="is-rounded"
                isPulled="right"
                isSize="large"
                isColor="success"
              >
                Create
              </Button>
            </Fragment>
          </HeroSlide>
        )}

        <HeroSlide subtitle="Let's now add up some info for your profile">
          {currentUser && (
            <InfoForm
              firstName={firstName}
              lastName={lastName}
              bio={bio}
              onFirstNameChange={e =>
                this.setState({ firstName: e.target.value })
              }
              onLastNameChange={e =>
                this.setState({ lastName: e.target.value })
              }
              onBioChange={e => this.setState({ bio: e.target.value })}
              onSubmitInfoForm={this.goNext}
            />
          )}
        </HeroSlide>

        <HeroSlide subtitle="What languages do you speak?">
          {currentUser && (
            <Field>
              <Label>Select:</Label>
              <Control>
                <Select onChange={this.handleLanguageSelect}>
                  {allLanguages.map(language => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </Select>
              </Control>
              <Flex wrap="wrap">
                {languages.map(language => (
                  <Tag
                    key={language.value}
                    value={language.value}
                    isColor="warning"
                    isSize="small"
                    style={{ marginTop: 12, marginRight: 12 }}
                  >
                    {language.label}{' '}
                    <Delete
                      isSize="medium"
                      onClick={() => this.handleRemoveLanguage(language)}
                    />
                  </Tag>
                ))}
              </Flex>

              <Control style={{ paddingTop: 24 }}>
                <Button
                  disabled={languages.length === 0}
                  onClick={this.saveInfo}
                  className="is-rounded"
                  isPulled="right"
                >
                  Save and Continue
                </Button>
              </Control>
            </Field>
          )}
        </HeroSlide>
      </Slider>
    );
  }
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const InfoForm = ({
  firstName,
  lastName,
  bio,
  onFirstNameChange,
  onLastNameChange,
  onBioChange,
  onSubmitInfoForm
}) => (
  <Fragment>
    <Field>
      <Control>
        <Input
          type="text"
          placeholder="first name"
          value={firstName || ''}
          onChange={onFirstNameChange}
          className="is-rounded"
          style={{ color: '#3e3e3e' }}
        />
      </Control>
    </Field>

    <Field>
      <Control>
        <Input
          type="text"
          placeholder="last name"
          value={lastName || ''}
          onChange={onLastNameChange}
          className="is-rounded"
          style={{ color: '#3e3e3e' }}
        />
      </Control>
    </Field>

    <Field>
      <Control>
        <TextArea
          type="text"
          placeholder="bio"
          onChange={onBioChange}
          className="is-rounded"
          style={{ color: '#3e3e3e', borderRadius: 20 }}
          value={bio || ''}
        />
      </Control>
    </Field>

    <Field>
      <Button
        onClick={onSubmitInfoForm}
        className="is-rounded"
        isPulled="right"
      >
        Next
      </Button>
    </Field>
  </Fragment>
);

export default Splash;
