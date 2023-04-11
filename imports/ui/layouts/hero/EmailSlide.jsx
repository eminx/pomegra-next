import React, { Fragment } from "react";
import { Field, Control, Input, Button } from "bloomer";

import HeroSlide from "../../components/HeroSlide";

const EmailSlide = ({
  email,
  isEmailInvalid,
  onChange,
  onButtonClick,
  initLogin,
  children,
}) =>
  children || (
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
              style={{ color: "#3e3e3e" }}
              isColor={
                email.length === 0
                  ? "info"
                  : isEmailInvalid
                  ? "warning"
                  : "success"
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

        <div style={{ paddingTop: 100 }}>
          <p style={{ textAlign: "center", marginBottom: 12 }}>
            Already have an account?
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              isSize="small"
              isOutlined
              isColor="light"
              onClick={initLogin}
              className="is-rounded"
            >
              Login
            </Button>
          </div>
        </div>
      </Fragment>
    </HeroSlide>
  );

export default EmailSlide;
