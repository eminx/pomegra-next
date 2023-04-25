import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AutoCenter, NavBar, Tag } from 'antd-mobile';
import { Avatar, Box, Center, Image, Stack, Text } from '@chakra-ui/react';
import { Title, Subtitle } from 'bloomer';

import { UserContext } from '../Layout';
import AppTabBar from '../components/AppTabBar';
import { call } from '../../api/_utils/functions';

const imageProps = {
  borderRadius: '8px',
  boxShadow: '0 0 24px 12px rgb(255 241 252)',
  border: '1px solid #fff',
};

function PublicProfile() {
  const [state, setState] = useState({
    user: null,
    isLoading: true,
  });
  const { currentUser } = useContext(UserContext);
  const { username } = useParams();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const respond = await call('getUserProfile', username);
      setState({
        ...state,
        user: respond,
        isLoading: false,
      });
    } catch (error) {
      errorDialog(error.reason || error.error);
    }
  };

  const { user, isLoading } = state;

  if (isLoading || !user) {
    return null;
  }

  return (
    <div style={{ height: '100%', marginBottom: 80 }}>
      <NavBar backArrow={false}>{user.username}</NavBar>

      <Box p="2" mt="4">
        <Center>
          {user.images ? (
            <Image height="240px" src={user.images[0]} {...imageProps} />
          ) : (
            <Avatar size="2xl" name={user.username} {...imageProps} />
          )}
        </Center>

        <Center pt="2">
          <Title isSize={5}>{user.username}</Title>
        </Center>
      </Box>

      <Box>
        <AutoCenter>
          {user.firstName && user.lastName && (
            <Subtitle isSize={5} style={{ textAlign: 'center' }}>
              {user.firstName + ' ' + user.lastName}
            </Subtitle>
          )}
          {user.bio && (
            <Text fontSize="md" textAlign="center">
              {user.bio}
            </Text>
          )}
        </AutoCenter>
      </Box>

      <Box py="4">
        <Subtitle isSize={6} style={{ color: '#656565', marginBottom: 4, textAlign: 'center' }}>
          reads in:
        </Subtitle>
        <Stack direction="row" justify="center" wrap="wrap">
          {user?.languages?.map((language) => (
            <Tag key={language.value} color="primary" fill="outline" style={{ fontSize: '12px' }}>
              {language.label.toUpperCase()}{' '}
            </Tag>
          ))}
        </Stack>
      </Box>

      <AppTabBar />
    </div>
  );
}

export default PublicProfile;
