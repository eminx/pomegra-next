import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { NavBar, List, ActivityIndicator } from 'antd-mobile';
import { UserContext } from './Layout';

const ListItem = List.Item;
const Brief = ListItem.Brief;

class Discover extends Component {
  state = {
    redirectToBookDetail: null,
    books: [],
    isLoading: true,
  };

  componentDidMount() {
    Meteor.call('getDiscoverBooks', (error, respond) => {
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

    if (books.length === 0) {
      return <ActivityIndicator toast text="Loading..." />;
    }

    if (redirectToBookDetail) {
      return <Redirect to={`/book/${redirectToBookDetail}`} />;
    }

    return (
      <div name="books">
        <NavBar mode="light">Books</NavBar>
        <List renderHeader={() => 'Suggested books for you'}>
          {books &&
            books.length > 0 &&
            books.map((suggestedBook) => (
              <ListItem
                key={suggestedBook._id}
                align="top"
                thumb={
                  <img
                    style={{ width: 33, height: 44 }}
                    src={suggestedBook.image_url}
                  />
                }
                multipleLine
                extra={suggestedBook.b_cat}
                onClick={() =>
                  this.viewBookInDetail(suggestedBook._id)
                }
              >
                <b>{suggestedBook.b_title}</b>
                <Brief>{suggestedBook.b_author}</Brief>
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

Discover.contextType = UserContext;

export default Discover;
