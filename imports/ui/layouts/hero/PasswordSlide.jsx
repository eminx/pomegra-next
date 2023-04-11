import React, { Fragment } from "react";
import { Field, Control, Input, Help, Button } from "bloomer";
import HeroSlide from "../../components/HeroSlide";

const PasswordSlide = ({
  password,
  isPasswordInvalid,
  onChange,
  onButtonClick,
}) => (
  <HeroSlide subtitle="Create a password" isColor="dark">
    <Fragment>
      <Field>
        <Control>
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={onChange}
            isSize="large"
            className="is-rounded"
            style={{ color: "#3e3e3e" }}
            isColor={
              password.length === 0
                ? "info"
                : isPasswordInvalid
                ? "warning"
                : "success"
            }
          />
        </Control>
        <Help isColor={isPasswordInvalid ? "warning" : "success"}>
          {isPasswordInvalid ? "not strong enought" : "looks great"}
        </Help>
      </Field>
      <Button
        disabled={isPasswordInvalid}
        onClick={onButtonClick}
        className="is-rounded"
        isPulled="right"
        isSize="large"
        isColor="success"
      >
        Create
      </Button>
    </Fragment>
  </HeroSlide>
);

export default PasswordSlide;
