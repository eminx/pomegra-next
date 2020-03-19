import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  NavBar,
  List,
  SearchBar,
  SegmentedControl,
  WhiteSpace,
  WingBlank
} from 'antd-mobile';

const ListItem = List.Item;

import { Requests } from '../../imports/api/collections';
import AppTabBar from '../reusables/AppTabBar';
import { Redirect } from 'react-router-dom';

const requestTypeValues = ['All', 'By Me', 'From Me'];

class RequestsList extends Component {
  state = {
    filterValue: '',
    requestType: 'All',
    gotoRequest: null
  };

  handleFilter = value => {
    this.setState({ filterValue: value });
  };

  handleTypeChange = value => {
    this.setState({
      requestType: value
    });
  };

  getTypeOfRequests = () => {
    const { requests, currentUser } = this.props;
    const currentUserId = currentUser._id;
    switch (this.state.requestType) {
      case 'By Me':
        return requests.filter(request => request.req_by === currentUserId);
      case 'From Me':
        return requests.filter(request => request.req_from === currentUserId);
      default:
        return requests;
    }
  };

  viewRequestInDetail = request => {
    this.setState({ gotoRequest: request._id });
  };

  render() {
    const { requests, currentUser } = this.props;
    const { filterValue, requestType, gotoRequest } = this.state;

    if (gotoRequest) {
      return <Redirect to={`/request/${gotoRequest}`} />;
    }

    if (!requests || !currentUser) {
      return (
        <div>
          <NavBar>No account</NavBar>
          <div style={{ textAlign: 'center' }}>Please create an account</div>
        </div>
      );
    }

    const typeOfRequests = this.getTypeOfRequests();

    const filteredRequests = typeOfRequests.filter(request => {
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

        <WingBlank size="md">
          <SegmentedControl
            selectedIndex={requestTypeValues.findIndex(
              value => value === requestType
            )}
            values={requestTypeValues}
            onValueChange={value => this.handleTypeChange(value)}
          />
        </WingBlank>

        <WhiteSpace size="md" />

        <List
          renderHeader={() => 'Your Previous Requests'}
          style={{ marginBottom: 64 }}
        >
          {filteredRequests &&
            filteredRequests.map(request => (
              <ListItem
                key={request._id}
                multipleLine
                align="top"
                thumb={request.book_image_url}
                extra={
                  request.date_requested &&
                  request.date_requested.toLocaleDateString()
                }
                onClick={() => this.viewRequestInDetail(request)}
              >
                <b>
                  {currentUser.username === request.owner_name
                    ? request.requester_name
                    : request.owner_name}
                </b>
                <ListItem.Brief>{request.book_name}</ListItem.Brief>
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
