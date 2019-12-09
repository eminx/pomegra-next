import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Page, Navbar, List, ListItem } from 'framework7-react';

class MyBooks extends Component {
  state = {};

  viewBookInDetail = myBook => {
    this.$f7router.navigate('/book-detail/', {
      props: {
        myBook,
      },
    });
  };

  render() {
    const { currentUser, myBooks } = this.props;

    return (
      <Page name="books">
        <Navbar backLink title="My Books"></Navbar>
        <List mediaList>
          {myBooks &&
            myBooks.length > 0 &&
            myBooks.map(myBook => (
              <ListItem
                mediaItem
                key={myBook._id || myBook.b_title}
                link="#"
                after={myBook.b_cat}
                title={myBook.b_title}
                subtitle={myBook.b_author}
                // text={myBook.description}
                onClick={() => this.viewBookInDetail(myBook)}
              >
                <img
                  slot="media"
                  src={myBook.image_url}
                  width={40}
                  height={60}
                />
              </ListItem>
            ))}
        </List>
      </Page>
    );
  }
}

export default MyBooksContainer = withTracker(props => {
  const currentUser = Meteor.user();
  Meteor.subscribe('myBooks');
  const myBooks =
    currentUser && Books.find({ added_by: currentUser._id }).fetch();
  return {
    currentUser,
    myBooks,
  };
})(MyBooks);
