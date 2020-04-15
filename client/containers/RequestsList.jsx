import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {
  ActivityIndicator,
  NavBar,
  List,
  SearchBar,
  SegmentedControl,
  WhiteSpace,
  WingBlank,
  Badge,
  Result,
} from 'antd-mobile';

import { UserContext } from './Layout';

const ListItem = List.Item;

const requestTypeValues = ['All', 'By Me', 'From Me'];

class RequestsList extends Component {
  state = {
    filterValue: '',
    requestType: 'All',
    gotoRequest: null,
    requests: [],
    isLoading: true,
    noRequest: false,
  };

  componentDidMount() {
    this.getRequests();
  }

  getRequests = () => {
    const { currentUser } = this.context;
    if (!currentUser) {
      return;
    }

    Meteor.call('getRequests', (error, respond) => {
      this.setState({
        requests: respond,
        isLoading: false,
      });
    });

    const noRequest = () => {
      if (this.state.requests.length === 0) {
        this.setState({ noRequest: true });
      }
    };

    setTimeout(noRequest, 3000);
  };

  handleFilter = (value) => {
    this.setState({ filterValue: value });
  };

  handleTypeChange = (value) => {
    this.setState({
      requestType: value,
    });
  };

  getTypeOfRequests = () => {
    const { currentUser } = this.context;
    const { requests } = this.state;
    const currentUserId = currentUser._id;
    switch (this.state.requestType) {
      case 'By Me':
        return requests.filter(
          (request) => request.req_by === currentUserId,
        );
      case 'From Me':
        return requests.filter(
          (request) => request.req_from === currentUserId,
        );
      default:
        return requests;
    }
  };

  viewRequestInDetail = (request) => {
    this.setState({ gotoRequest: request._id });
  };

  getNotificationsCount = (request) => {
    const { currentUser } = this.context;
    const foundContext =
      currentUser.notifications &&
      currentUser.notifications.find((notification) => {
        return notification.contextId === request._id;
      });

    return foundContext && foundContext.count;
  };

  render() {
    const { requests, currentUser } = this.context;
    const {
      filterValue,
      requestType,
      gotoRequest,
      noRequest,
    } = this.state;

    if (gotoRequest) {
      return <Redirect to={`/request/${gotoRequest}`} />;
    }

    if (noRequest) {
      return (
        <Result
          // img={myImg(request.book_image_url)}
          title="No Interactions just yet"
          message="Please feel free to go to the discover section and request a book from someone. People are all nice here"
        />
      );
    }

    if (!requests || !currentUser) {
      return <ActivityIndicator toast text="Loading..." />;
    }

    const typeOfRequests = this.getTypeOfRequests();

    const filteredRequests = typeOfRequests.filter((request) => {
      return (
        request.book_name
          .toLowerCase()
          .indexOf(filterValue.toLowerCase()) !== -1 ||
        request.owner_name
          .toLowerCase()
          .indexOf(filterValue.toLowerCase()) !== -1 ||
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
          onChange={(value) => this.handleFilter(value)}
          onClear={() => this.setState({ filterValue: '' })}
          style={{ touchAction: 'none' }}
        />

        <WingBlank size="md">
          <SegmentedControl
            selectedIndex={requestTypeValues.findIndex(
              (value) => value === requestType,
            )}
            values={requestTypeValues}
            onValueChange={(value) => this.handleTypeChange(value)}
          />
        </WingBlank>

        <WhiteSpace size="md" />

        <List
          renderHeader={() => 'Your Previous Requests'}
          style={{ marginBottom: 64 }}
        >
          {filteredRequests &&
            filteredRequests.map((request) => (
              <ListItem
                key={request._id}
                multipleLine
                align="top"
                thumb={request.book_image_url}
                onClick={() => this.viewRequestInDetail(request)}
                extra={
                  request.date_requested &&
                  request.date_requested.toLocaleDateString()
                }
              >
                <div>
                  <Badge dot={this.getNotificationsCount(request)}>
                    <b>
                      {currentUser.username === request.owner_name
                        ? request.requester_name
                        : request.owner_name}
                    </b>
                  </Badge>
                  <ListItem.Brief>{request.book_name}</ListItem.Brief>
                </div>
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

RequestsList.contextType = UserContext;

export default RequestsList;
