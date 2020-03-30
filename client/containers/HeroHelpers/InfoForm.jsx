import React from 'react';
import { Field, Control, Input, TextArea, Button } from 'bloomer';

import HeroSlide from '../../reusables/HeroSlide';

const InfoForm = ({
  firstName,
  lastName,
  bio,
  onFirstNameChange,
  onLastNameChange,
  onBioChange,
  onSubmitInfoForm
}) => (
  <HeroSlide
    subtitle="Let's now add up some info for your profile"
    isColor="dark"
  >
    <Field>
      <Control>
        <Input
          type="text"
          placeholder="first name"
          value={firstName || ''}
          onChange={onFirstNameChange}
          // className="is-rounded"
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
          // className="is-rounded"
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
          // className="is-rounded"
          style={{ color: '#3e3e3e' }}
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
  </HeroSlide>
);

export default InfoForm;
