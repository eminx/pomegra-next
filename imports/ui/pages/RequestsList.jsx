import { Meteor } from "meteor/meteor";
import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";

import {
  NavBar,
  List,
  SearchBar,
  SegmentedControl,
  Badge,
  Result,
} from "antd-mobile";

import { UserContext } from "../Layout";

const ListItem = List.Item;

const requestTypeValues = ["All", "By Me", "From Me"];

class RequestsList extends Component {
  state = {
    filterValue: "",
    requestType: "All",
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

    Meteor.call("getRequests", (error, respond) => {
      this.setState({
        requests: respond,
        isLoading: false,
        noRequest: Boolean(respond && respond.length === 0),
      });
    });
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
      case "By Me":
        return requests.filter(
          (request) => request.requesterId === currentUserId
        );
      case "From Me":
        return requests.filter((request) => request.ownerId === currentUserId);
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
    const { currentUser } = this.context;
    const { requests, filterValue, requestType, gotoRequest, noRequest } =
      this.state;

    if (gotoRequest) {
      return <Redirect to={`/request/${gotoRequest}`} />;
    }

    if (noRequest) {
      return (
        <Fragment>
          <NavBar mode="light">Requests</NavBar>

          <Result
            // img={myImg(request.bookImage)}
            title="No Interactions just yet"
            message="Please feel free to go to the discover section and request a book from someone. People are all nice here"
          />
        </Fragment>
      );
    }

    if (!requests || !currentUser) {
      return <div>Loading...</div>;
    }

    const typeOfRequests = this.getTypeOfRequests();

    const filteredRequests = typeOfRequests.filter((request) => {
      return (
        request.bookTitle.toLowerCase().indexOf(filterValue.toLowerCase()) !==
          -1 ||
        request.ownerUsername
          .toLowerCase()
          .indexOf(filterValue.toLowerCase()) !== -1 ||
        request.requesterUsername
          .toLowerCase()
          .indexOf(filterValue.toLowerCase()) !== -1
      );
    });

    return (
      <div name="requests">
        <NavBar mode="light">Messages</NavBar>
        <SearchBar
          placeholder="Filter"
          cancelText="Cancel"
          onChange={(value) => this.handleFilter(value)}
          onClear={() => this.setState({ filterValue: "" })}
          style={{ touchAction: "none" }}
        />

        <SegmentedControl
          selectedIndex={requestTypeValues.findIndex(
            (value) => value === requestType
          )}
          values={requestTypeValues}
          onValueChange={(value) => this.handleTypeChange(value)}
        />

        <Divider />

        <List
          renderHeader={() => "Your Previous Requests"}
          style={{ marginBottom: 64 }}
        >
          {filteredRequests &&
            filteredRequests.map((request) => (
              <ListItem
                key={request._id}
                multipleLine
                align="top"
                thumb={request.bookImage}
                onClick={() => this.viewRequestInDetail(request)}
                extra={
                  request.dateRequested &&
                  request.dateRequested.toLocaleDateString()
                }
              >
                <div>
                  <Badge dot={this.getNotificationsCount(request)}>
                    <b>
                      {currentUser.username === request.ownerUsername
                        ? request.requesterUsername
                        : request.ownerUsername}
                    </b>
                  </Badge>
                  <ListItem.Brief>{request.bookTitle}</ListItem.Brief>
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
