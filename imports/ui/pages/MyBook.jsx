import { Meteor } from "meteor/meteor";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, NavBar, Icon } from "antd-mobile";

import { BookCard } from "../components/BookCard";
import EditBook from "../components/EditBook";
import { errorDialog, successDialog } from "../../api/_utils/functions";
import { UserContext } from "../Layout";

function MyBook() {
  const [book, setBook] = useState(null);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.call("getMyBook", id, (error, respond) => {
      setBook(respond);
      setIsLoading(false);
    });
  }, []);

  const updateBook = (values) => {
    if (values.language) {
      values.language = values.language[0];
    } else {
      values.language = book.language;
    }

    Meteor.call("updateBook", book._id, values, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
      } else {
        successDialog("Your book is successfully updated");
      }
    });
  };

  if (isLoading || !book) {
    return null;
  }

  return (
    <>
      <NavBar
        mode="light"
        leftContent={<Icon type="left" />}
        onBack={() => navigate("/my-shelf")}
        rightContent={<Icon type="ellipsis" />}
      >
        <b>{book.title}</b>
      </NavBar>

      <BookCard
        book={book}
        onButtonClick={() => setIsEditDialog(true)}
        buttonType="ghost"
        buttonText="Edit"
      />

      <Modal
        visible={currentUser && isEditDialog}
        position="top"
        closable
        onClose={() => setIsEditDialog(false)}
        title="Edit Book"
      >
        <EditBook book={book} onSubmit={(values) => updateBook(values)} />
      </Modal>
    </>
  );
}

export default MyBook;
