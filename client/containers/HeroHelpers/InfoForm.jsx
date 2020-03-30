import React, { Fragment } from 'react';
import { Field, Control, Input, TextArea, Button } from 'bloomer';

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
  </Fragment>
);

export default InfoForm;
