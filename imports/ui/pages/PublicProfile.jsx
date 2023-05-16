import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AutoCenter, Button, NavBar, Popup, Tag } from 'antd-mobile';
import { Avatar, Box, Center, Divider, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { Subtitle } from 'bloomer';
import { CloseOutline } from 'antd-mobile-icons';

import EditProfile from '../components/EditProfile';
import AppTabBar from '../components/AppTabBar';
import { call, errorDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';
import MyBooks from '../components/MyBooks';

const imageProps = {
  borderRadius: '8px',
  boxShadow: '0 0 24px 12px rgb(255 241 252)',
  border: '1px solid #fff',
};

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

function About({ user }) {
  if (!user) {
    return null;
  }
  return (
    <Box>
      <Center p="2">
        {user.images && user.images.length > 0 ? (
          <Image height="240px" src={user.images[0]} {...imageProps} />
        ) : (
          <Avatar size="2xl" name={user.username} {...imageProps} />
        )}
      </Center>

      <AutoCenter>
        {user.firstName && user.lastName && (
          <Subtitle isSize={5} style={{ textAlign: 'center', marginBottom: 0 }}>
            {user.firstName + ' ' + user.lastName}
          </Subtitle>
        )}
        {user.bio && (
          <Text fontSize="md" textAlign="center">
            {user.bio}
          </Text>
        )}
      </AutoCenter>

      <Box py="2">
        {/* <Subtitle isSize={6} style={{ color: '#656565', marginBottom: 4, textAlign: 'center' }}>
        reads in:
      </Subtitle> */}
        <Stack direction="row" justify="center" wrap="wrap">
          {user.languages &&
            user.languages.length > 0 &&
            user.languages.map((language) => (
              <Tag
                key={language?.value}
                color="primary"
                fill="outline"
                style={{ fontSize: '12px' }}
              >
                {language?.label?.toUpperCase()}{' '}
              </Tag>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default PublicProfile;
