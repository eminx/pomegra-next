import React from 'react';
import { Carousel, WingBlank, WhiteSpace } from 'antd-mobile';
import { Subtitle, Button } from 'bloomer';
import { Avatar, Image } from '@chakra-ui/react';
import HeroSlide from '../../reusables/HeroSlide';
import { Title } from 'bloomer/lib/elements/Title';

const ProfileView = ({ currentUser, onButtonClick }) => {
  if (!currentUser) {
    return null;
  }
  return (
    <HeroSlide
      isPaddingless
      isColor="dark"
      hasTextColor="light"
      className="no-padding-hero align-start"
    >
      {currentUser.coverImages && currentUser.coverImages.length > 0 && (
        <Carousel autoplay infinite style={{ width: '100vw' }}>
          {currentUser.coverImages.map((image) => (
            <Image
              key={image}
              src={image}
              style={{
                width: '100vw',
                height: 300,
              }}
              fit="cover"
            />
          ))}
        </Carousel>
      )}

      <WhiteSpace size="md" />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          name={currentUser.username}
          src={currentUser.avatar && currentUser.avatar.url}
          size="xl"
        />
        <Title isSize={3}>{currentUser.username}</Title>
        <Subtitle isSize={5}>
          {currentUser.firstName + ' ' + currentUser.lastName}
        </Subtitle>

        <WhiteSpace size="lg" />
        <Subtitle isSize={6} hasTextAlign="centered">
          Looking good! <br />
          Now, let's add some books from your library
        </Subtitle>

        <WhiteSpace />

        <Button
          onClick={onButtonClick}
          className="is-rounded"
          isPulled="right"
          isColor="success"
        >
          Add Books
        </Button>
      </div>
    </HeroSlide>
  );
};

export default ProfileView;
