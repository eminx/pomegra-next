import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, List, NavBar, Result, SearchBar } from 'antd-mobile';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

import { UserContext } from '../Layout';
import AppTabBar from '../components/AppTabBar';
import { call } from '../../api/_utils/functions';

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
  const navigate = useNavigate();

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    try {
      const respond = await call('getMyRequests');
      setState({
        ...state,
        requests: respond,
        isLoading: false,
        noRequest: Boolean(respond && respond.length === 0),
      });
    } catch (error) {
      console.log(error);
    }
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

  const getNotificationsCount = (request) => {
    const foundContext =
      currentUser?.notifications &&
      currentUser?.notifications.find((notification) => {
        return notification?.contextId === request?._id;
      });

    return foundContext?.count;
  };

  const { requests, filterValue } = state;

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

      {!requests ||
        (requests.length === 0 && (
          <Result
            // img={myImg(request.bookImage)}
            title="No Interactions just yet"
            description="Please feel free to go to the discover section and request a book from someone. People are all nice here"
          />
        ))}

      <List style={{ marginBottom: 64 }}>
        {filteredRequests?.map((request) => (
          <ListItem
            key={request._id}
            extra={request?.dateRequested?.toLocaleDateString()}
            onClick={() => navigate(`/request/${request._id}`)}
          >
            <Flex>
              <Badge bordered content={getNotificationsCount(request)}>
                <Image mr="8" bg="purple.50" fit="contain" w="48px" src={request.bookImage} />
              </Badge>
              <Box w="100%" fontSize=".8em">
                <b>
                  {currentUser.username === request.ownerUsername
                    ? request.requesterUsername
                    : request.ownerUsername}
                </b>
                <Text>{request.bookTitle}</Text>
              </Box>
            </Flex>
          </ListItem>
        ))}
      </List>

      <AppTabBar />
    </div>
  );
}

export default RequestsList;
