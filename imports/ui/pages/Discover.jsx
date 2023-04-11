import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { NavBar, List } from "antd-mobile";

import { UserContext } from "../Layout";

const ListItem = List.Item;

class Discover extends Component {
  state = {
    redirectToBookDetail: null,
    books: [],
    isLoading: true,
  };

  componentDidMount() {
    Meteor.call("getDiscoverBooks", (error, respond) => {
      console.log(respond);
      this.setState({
        books: respond,
        isLoading: false,
      });
    });
  }

  viewBookInDetail = (suggestedBookId) => {
    this.setState({
      redirectToBookDetail: suggestedBookId,
    });
  };

  render() {
    const { currentUser } = this.context;
    const { books, redirectToBookDetail } = this.state;

    if (!books || books.length === 0) {
      // return <ActivityIndicator toast text="Loading..." />;
      return;
    }

    if (redirectToBookDetail) {
      return <Redirect to={`/book/${redirectToBookDetail}`} />;
    }

    return (
      <div name="books">
        <NavBar mode="light">Books</NavBar>
        <List renderHeader={() => "Suggested books for you"}>
          {books &&
            books.length > 0 &&
            books.map((suggestedBook) => (
              <ListItem
                key={suggestedBook._id}
                align="top"
                thumb={
                  <img
                    style={{ width: 33, height: 44 }}
                    src={suggestedBook.imageUrl}
                  />
                }
                multipleLine
                extra={suggestedBook.category}
                onClick={() => this.viewBookInDetail(suggestedBook._id)}
              >
                <b>{suggestedBook.title}</b>
                {suggestedBook.authors &&
                  suggestedBook.authors.map((author) => (
                    <div key={author}>{author}</div>
                  ))}
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

Discover.contextType = UserContext;

export default Discover;
