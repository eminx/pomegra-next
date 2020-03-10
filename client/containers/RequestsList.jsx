import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Page,
  Navbar,
  List,
  ListItem,
  Subnavbar,
  Searchbar
} from 'framework7-react';

import { Requests } from '../../imports/api/collections';

class RequestsList extends Component {
  viewRequestInDetail = request => {
    this.$f7router.navigate('/request/', {
      props: {
        request
      }
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
        <Navbar backLink title="Requests">
          <Subnavbar inner={false}>
            <Searchbar
              searchContainer=".search-list"
              searchIn=".item-title, .item-subtitle, .item-extra"
              disableButton={!this.$theme.aurora}
              placeholder="Filter"
            ></Searchbar>
          </Subnavbar>
        </Navbar>

        <List className="searchbar-not-found">
          <ListItem title="Nothing found" />
        </List>

        <List mediaList className="search-list searchbar-found">
          {requests &&
            requests.map(request => (
              <ListItem
                mediaItem
                key={request._id}
                link="#"
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
                <span style={{ visibility: 'hidden' }} className="item-extra">
                  {request.book_author}
                </span>
              </ListItem>
            ))}
        </List>
      </Page>
    );
  }
}

export default RequestsListComponent = withTracker(props => {
  const currentUser = Meteor.user();
  Meteor.subscribe('myRequests');
  const requests = currentUser && Requests.find().fetch();
  return {
    requests,
    currentUser
  };
})(RequestsList);
