import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import { NavBar, List, ActivityIndicator } from 'antd-mobile';

const ListItem = List.Item;
const Brief = ListItem.Brief;

class Find extends Component {
  state = {
    redirectToBookDetail: null
  };

  viewBookInDetail = suggestedBookId => {
    this.setState({
      redirectToBookDetail: suggestedBookId
    });
  };

  render() {
    const { currentUser, othersBooks } = this.props;
    const { redirectToBookDetail } = this.state;

    if (!currentUser || !othersBooks) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 50
          }}
        >
          <ActivityIndicator text="Loading..." />
        </div>
      );
    }

    if (redirectToBookDetail) {
      return <Redirect to={`/book/${redirectToBookDetail}`} />;
    }

    return (
      <div name="books">
        <NavBar mode="light">Books</NavBar>
        <List renderHeader={() => 'Suggested books for you'}>
          {othersBooks &&
            othersBooks.length > 0 &&
            othersBooks.map(suggestedBook => (
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
                onClick={() => this.viewBookInDetail(suggestedBook._id)}
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

export default FindContainer = withTracker(props => {
  const currentUser = Meteor.user();
  Meteor.subscribe('othersBooks');
  const othersBooks = currentUser && Books.find().fetch();

  return {
    currentUser,
    othersBooks
  };
})(Find);
