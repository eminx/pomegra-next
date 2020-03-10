import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Page, Navbar, List, ListItem } from 'framework7-react';

class Find extends Component {
  state = {};

  viewBookInDetail = result => {
    this.$f7router.navigate('/book-detail-tobe-requested/', {
      props: {
        bookInfo: result
      }
    });
  };

  render() {
    const { currentUser, othersBooks } = this.props;

    const detailListItemStyle = {
      justifyContent: 'flex-end',
      height: 18,
      fontSize: 12
    };

    if (!othersBooks) {
      return;
    }

    return (
      <Page name="books">
        <Navbar title="Suggested Books" backLink />
        <List mediaList>
          {othersBooks &&
            othersBooks.length > 0 &&
            othersBooks.map(suggestedBook => (
              <ListItem
                mediaItem
                key={suggestedBook._id || suggestedBook.b_title}
                link="#"
                after={suggestedBook.b_cat}
                title={suggestedBook.b_title}
                subtitle={suggestedBook.b_author}
                // text={suggestedBook.description}
                onClick={() => this.viewBookInDetail(suggestedBook)}
              >
                <img
                  slot="media"
                  src={suggestedBook.image_url}
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

export default FindContainer = withTracker(props => {
  const currentUser = Meteor.user();
  Meteor.subscribe('othersBooks');
  const othersBooks = currentUser && Books.find().fetch();

  return {
    currentUser,
    othersBooks
  };
})(Find);
