import { Meteor } from 'meteor/meteor';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Badge, Divider, List, NavBar, Result, SearchBar, SegmentedControl } from 'antd-mobile';
import { Box } from '@chakra-ui/react';

import { UserContext } from '../Layout';
import AppTabBar from '../components/AppTabBar';

const ListItem = List.Item;

const requestTypeValues = ['All', 'By Me', 'From Me'];

function RequestsList() {
  const [state, setState] = useState({
    filterValue: '',
    requestType: 'All',
    gotoRequest: null,
    requests: [],
    isLoading: true,
    noRequest: false,
  });
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = () => {
    if (!currentUser) {
      return;
    }

    Meteor.call('getRequests', (error, respond) => {
      setState({
        ...state,
        requests: respond,
        isLoading: false,
        noRequest: Boolean(respond && respond.length === 0),
      });
    });
  };

  const handleFilter = (value) => {
    setState({ ...state, filterValue: value });
  };

  const handleTypeChange = (value) => {
    setState({
      ...state,
      requestType: value,
    });
  };

  const getTypeOfRequests = () => {
    const { requests } = state;
    const currentUserId = currentUser._id;
    switch (state.requestType) {
      case 'By Me':
        return requests.filter((request) => request.requesterId === currentUserId);
      case 'From Me':
        return requests.filter((request) => request.ownerId === currentUserId);
      default:
        return requests;
    }
  };

  const viewRequestInDetail = (request) => {
    setState({ ...state, gotoRequest: request._id });
  };

  const getNotificationsCount = (request) => {
    const foundContext =
      currentUser?.notifications &&
      currentUser?.notifications.find((notification) => {
        return notification?.contextId === request?._id;
      });

    return foundContext?.count;
  };

  const { requests, filterValue, requestType, gotoRequest, noRequest } = state;

  if (gotoRequest) {
    return <Redirect to={`/request/${gotoRequest}`} />;
  }

  if (!requests || !currentUser) {
    return <div>Loading...</div>;
  }

  const typeOfRequests = getTypeOfRequests();

  const filteredRequests = typeOfRequests.filter((request) => {
    return (
      request.bookTitle.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      request.ownerUsername.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      request.requesterUsername.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  });

  return (
    <div name="requests">
      <NavBar backArrow={false}>Messages</NavBar>
      <Box p="2">
        <SearchBar
          placeholder="Filter"
          cancelText="Cancel"
          onChange={(value) => handleFilter(value)}
          onClear={() => setState({ ...state, filterValue: '' })}
          style={{ touchAction: 'none' }}
        />
      </Box>

      {/* <SegmentedControl
        selectedIndex={requestTypeValues.findIndex((value) => value === requestType)}
        values={requestTypeValues}
        onValueChange={(value) => handleTypeChange(value)}
      /> */}

      <Divider />

      {!requests ||
        (requests.length === 0 && (
          <Result
            // img={myImg(request.bookImage)}
            title="No Interactions just yet"
            description="Please feel free to go to the discover section and request a book from someone. People are all nice here"
          />
        ))}

      <List renderHeader={() => 'Your Previous Requests'} style={{ marginBottom: 64 }}>
        {filteredRequests?.map((request) => (
          <ListItem
            key={request._id}
            multipleLine
            align="top"
            thumb={request.bookImage}
            onClick={() => viewRequestInDetail(request)}
            extra={request?.dateRequested?.toLocaleDateString()}
          >
            <div>
              <Badge dot={getNotificationsCount(request)}>
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

      <AppTabBar />
    </div>
  );
}

export default RequestsList;
