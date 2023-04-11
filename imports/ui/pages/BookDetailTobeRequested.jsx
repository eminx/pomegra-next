import { Meteor } from "meteor/meteor";
import React, { useContext, useEffect, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { Divider, Icon, NavBar } from "antd-mobile";

import { BookCard } from "../components/BookCard";
import { errorDialog, successDialog } from "../../api/_utils/functions";
import { UserContext } from "../Layout";

function BookDetailTobeRequested() {
  const [book, setBook] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    Meteor.call("getSingleBook", id, (error, respond) => {
      setBook(respond);
      setIsLoading(false);
    });
  }, []);

  const makeRequest = () => {
    if (!currentUser) {
      errorDialog("Please create an account");
    }

    Meteor.call("makeRequest", book._id, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
      } else if (respond.error) {
        console.log(error);
        errorDialog(respond.error);
      } else {
        successDialog("Your request is successfully sent!");
        setRequestSuccess(respond);
      }
    });
  };

  if (requestSuccess) {
    return redirect(`/request/${requestSuccess}`);
  }

  if (backToDiscover) {
    return redirect("/discover");
  }

  if (!book || isLoading) {
    return null;
    // return <ActivityIndicator toast text="Loading book details..." />;
  }

  return (
    <div>
      <NavBar
        mode="light"
        leftContent={<Icon type="left" />}
        onLeftClick={() => redirect("/discover")}
        rightContent={<Icon type="ellipsis" />}
      >
        Details
      </NavBar>

      {book && (
        <Fragment>
          <Divider />
          <Space>
            <BookCard
              book={book}
              onButtonClick={() => makeRequest()}
              buttonType="primary"
              buttonText="Ask to Borrow"
            />
          </Space>
        </Fragment>
      )}
    </div>
  );
}

export default BookDetailTobeRequested;
