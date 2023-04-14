import React from 'react';
import { Divider, Swiper } from 'antd-mobile';
import { Subtitle, Button } from 'bloomer';
import { Avatar, Image } from '@chakra-ui/react';
import HeroSlide from '../../components/HeroSlide';
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
        <Swiper autoplay infinite style={{ width: '100vw' }}>
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
        </Swiper>
      )}

      <Divider />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar name={currentUser.username} src={currentUser.images[0]} size="xl" />
        <Title isSize={3}>{currentUser.username}</Title>
        <Subtitle isSize={5}>{currentUser.firstName + ' ' + currentUser.lastName}</Subtitle>

        <Divider />

        <Subtitle isSize={6} hasTextAlign="centered">
          Looking good! <br />
          Now, let's add some books from your library
        </Subtitle>

        <Divider />

        <Button onClick={onButtonClick} className="is-rounded" isPulled="right" isColor="success">
          Add Books
        </Button>
      </div>
    </HeroSlide>
  );
};

export default ProfileView;
