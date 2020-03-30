import React, { Fragment } from 'react';
import { Field, Control, Input, Button } from 'bloomer';
import HeroSlide from '../../reusables/HeroSlide';

const EmailSlide = ({ email, isEmailInvalid, onChange, onButtonClick }) => (
  <HeroSlide subtitle="Enter your private email address" isColor="dark">
    <Fragment>
      <Field>
        <Control>
          <Input
            type="email"
            placeholder="email address"
            value={email}
            onChange={onChange}
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
        onClick={onButtonClick}
        className="is-rounded"
        isPulled="right"
      >
        Next
      </Button>
    </Fragment>
  </HeroSlide>
);

export default EmailSlide;
