import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, NavBar, Popup } from 'antd-mobile';
import { Box, Center, Divider, Flex, Heading } from '@chakra-ui/react';
import { CloseOutline } from 'antd-mobile-icons';

import EditProfile from '../components/EditProfile';
import AppTabBar from '../components/AppTabBar';
import { call, errorDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';
import About from '../components/About';
import MyBooks from '../components/MyBooks';

function PublicProfile() {
  const [state, setState] = useState({
    books: [],
    user: null,
    isBookDialogOpen: false,
    isEditDialogOpen: false,
    isLoading: true,
  });

  const params = useParams();
  const { username } = params;
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const user = await call('getUserProfile', username);
      const books = await call('getUserBooks', username);
      setState({
        ...state,
        user,
        books,
        isLoading: false,
      });
    } catch (error) {
      errorDialog(error.reason || error.error);
    }
  };

  const { books, user, isEditDialogOpen, isLoading } = state;

  if (isLoading || !user) {
    return null;
  }

  return (
    <div style={{ height: '100%', marginBottom: 80 }}>
      <NavBar backArrow={false}>
        <b>{user.username}</b>
      </NavBar>

      {currentUser && currentUser.username === user.username && (
        <Center>
          <Button
            color="primary"
            fill="outline"
            size="small"
            onClick={() => setState({ ...state, isEditDialogOpen: true })}
          >
            Edit
          </Button>
        </Center>
      )}

      <Box py="2">
        <About user={user} />
        <Divider my="2" />
        <MyBooks books={books} />
      </Box>

      <Popup
        closable
        bodyStyle={{
          height: '93vh',
          overflow: 'scroll',
          padding: 12,
        }}
        position="bottom"
        title="Edit Your Profile"
        visible={user && isEditDialogOpen}
        onClose={() => setState({ ...state, isEditDialogOpen: false })}
      >
        <Flex justify="space-between" mb="4">
          <Heading size="md" fontWeight="normal">
            Edit profile
          </Heading>
          <CloseOutline
            fontSize="24px"
            onClick={() => setState({ ...state, isEditDialogOpen: false })}
          />
        </Flex>
        <EditProfile currentUser={user} />
      </Popup>

      <AppTabBar />
    </div>
  );
}

export default PublicProfile;
