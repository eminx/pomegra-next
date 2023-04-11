import React, { Fragment } from "react";
import { Field, Control, Help, Input, Button } from "bloomer";
import HeroSlide from "../../components/HeroSlide";

const UsernameSlide = ({
  username,
  isUsernameInvalid,
  onChange,
  onButtonClick,
}) => (
  <HeroSlide subtitle="Create a username" isColor="dark">
    <Fragment>
      <Field>
        <Control>
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={onChange}
            isSize="large"
            className="is-rounded"
            style={{ color: "#3e3e3e" }}
            isColor={
              username.length === 0
                ? "info"
                : isUsernameInvalid
                ? "warning"
                : "success"
            }
          />
        </Control>
        <Help
          isColor={
            username.length === 0
              ? "info"
              : isUsernameInvalid
              ? "warning"
              : "success"
          }
        >
          {username.length === 0
            ? null
            : isUsernameInvalid
            ? "username is not valid"
            : "username is valid"}
        </Help>
      </Field>

      <Button
        disabled={isUsernameInvalid}
        onClick={onButtonClick}
        className="is-rounded"
        isPulled="right"
      >
        Next
      </Button>
    </Fragment>
  </HeroSlide>
);

export default UsernameSlide;
