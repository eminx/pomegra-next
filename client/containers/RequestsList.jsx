import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Page, Navbar, List, ListItem } from 'framework7-react';

import { Requests } from '../../imports/api/collections';

class RequestsList extends Component {
  state = {};

  viewRequestInDetail = request => {
    this.$f7router.navigate('/request/', {
      props: {
        request,
      },
    });
  };

  render() {
    const { requests, currentUser } = this.props;

    if (!requests || !currentUser) {
      return (
        <Page>
          <Navbar title="No account" backLink />
          <div style={{ textAlign: 'center' }}>Please create an account</div>
        </Page>
      );
    }

    return (
      <Page name="requests">
        <Navbar backLink title="Requests"></Navbar>
        <List mediaList>
          {requests &&
            requests.length > 0 &&
            requests.map(request => (
              <ListItem
                mediaItem
                key={request._id}
                link="#"
                // after={request.  }
                title={request.book_name}
                subtitle={
                  currentUser.username === request.owner_name
                    ? request.requester_name
                    : request.owner_name
                }
                // text={myBook.description}
                onClick={() => this.viewRequestInDetail(request)}
              >
                <img
                  slot="media"
                  src={request.book_image_url}
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

export default RequestsListComponent = withTracker(props => {
  const currentUser = Meteor.user();
  const requests = Requests.find().fetch();
  return {
    requests,
    currentUser,
  };
})(RequestsList);
