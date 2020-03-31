import React from 'react';
import { Field, Control, Image, Subtitle, Button } from 'bloomer';
import HeroSlide from '../../reusables/HeroSlide';

const slideStyle = backgroundImage => ({
  position: 'absolute',
  width: 'calc(100vw - .5rem )',
  height: '40vh',
  top: '-3rem',
  left: '-1.5rem',
  backgroundImage: `url('${backgroundImage}')`,
  backgroundOosition: 'center',
  backgroundSize: 'cover'
});

const ProfileView = ({ currentUser, onButtonClick }) => (
  <HeroSlide isPaddingless isColor="dark" hasTextColor="light">
    <div style={{ position: 'relative' }}>
      <div
        style={
          currentUser &&
          currentUser.coverImages &&
          currentUser.coverImages[0] &&
          slideStyle(currentUser.coverImages[0].url)
        }
      >
        <Image
          isSize="128x128"
          src={currentUser && currentUser.avatar && currentUser.avatar.url}
          className="is-rounded"
          style={{ position: 'absolute', top: '30vh' }}
        />
      </div>
    </div>
    <Field style={{ marginTop: '50vh' }}>
      <Control style={{ paddingTop: 24 }}>
        <Subtitle isSize={6}>
          Now, let's add some books from your library
        </Subtitle>
        <Button
          onClick={onButtonClick}
          className="is-rounded"
          isPulled="right"
          isSize="large"
          isColor="success"
        >
          Add Books
        </Button>
      </Control>
    </Field>
  </HeroSlide>
);

export default ProfileView;
