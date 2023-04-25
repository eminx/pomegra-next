import React from 'react';
import { Field, Control, Input, TextArea, Button } from 'bloomer';

import HeroSlide from '../../components/HeroSlide';

function InfoForm({
  bio,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onBioChange,
  onSubmitInfoForm,
}) {
  return (
    <HeroSlide isColor="dark" isSkip subtitle="Let's now add up some info for your profile">
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
        <Button className="is-rounded" isPulled="right" onClick={onSubmitInfoForm}>
          Next
        </Button>
      </Field>
    </HeroSlide>
  );
}

export default InfoForm;
