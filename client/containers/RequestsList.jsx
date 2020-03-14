import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { NavBar, List, SearchBar, WhiteSpace } from 'antd-mobile';

const ListItem = List.Item;

import { Requests } from '../../imports/api/collections';

class RequestsList extends Component {
  state = {
    filterValue: ''
  };

  handleFilter = value => {
    this.setState({ filterValue: value });
  };

  viewRequestInDetail = request => {
    this.$f7router.navigate('/request/', {
      props: {
        request
      }
    });
  };

  render() {
    const { requests, currentUser } = this.props;
    const { filterValue } = this.state;

    if (!requests || !currentUser) {
      return (
        <div>
          <NavBar>No account</NavBar>
          <div style={{ textAlign: 'center' }}>Please create an account</div>
        </div>
      );
    }

    const filteredRequests = requests.filter(request => {
      return (
        request.book_name.toLowerCase().indexOf(filterValue.toLowerCase()) !==
          -1 ||
        request.owner_name.toLowerCase().indexOf(filterValue.toLowerCase()) !==
          -1 ||
        request.requester_name
          .toLowerCase()
          .indexOf(filterValue.toLowerCase()) !== -1
      );
    });

    return (
      <div name="requests">
        <NavBar mode="light">Requests</NavBar>
        <SearchBar
          placeholder="Filter"
          cancelText="Cancel"
          onChange={value => this.handleFilter(value)}
          onClear={() => this.setState({ filterValue: '' })}
        />

        <WhiteSpace size="md" />
        <List>
          {filteredRequests &&
            filteredRequests.map(request => (
              <ListItem
                key={request._id}
                thumb={request.book_image_url}
                extra={
                  currentUser.username === request.owner_name
                    ? request.requester_name
                    : request.owner_name
                }
                onClick={() => this.viewRequestInDetail(request)}
              >
                {request.book_name}
                <span style={{ visibility: 'hidden' }} className="item-extra">
                  {request.book_author}
                </span>
              </ListItem>
            ))}
        </List>
      </div>
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
