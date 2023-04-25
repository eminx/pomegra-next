import React, { useContext, useState } from 'react';
import { AutoCenter, Button, NavBar, Popup, Tag } from 'antd-mobile';
import { Avatar, Box, Center, Heading, Image, Flex, Stack, Text } from '@chakra-ui/react';
import { Title, Subtitle } from 'bloomer';
import { CloseOutline } from 'antd-mobile-icons';

import EditProfile from '../components/EditProfile';

import { UserContext } from '../Layout';
import AppTabBar from '../components/AppTabBar';

const imageProps = {
  borderRadius: '8px',
  boxShadow: '0 0 24px 12px rgb(255 241 252)',
  border: '1px solid #fff',
};

function Profile() {
  const { currentUser } = useContext(UserContext);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  return (
    <div style={{ height: '100%', marginBottom: 80 }}>
      <NavBar backArrow={false}>My Profile</NavBar>

      <Box p="2" mt="4">
        <Center>
          {currentUser.images ? (
            <Image height="240px" src={currentUser.images[0]} {...imageProps} />
          ) : (
            <Avatar size="2xl" name={currentUser.username} {...imageProps} />
          )}
        </Center>

        <Center pt="2">
          <Title isSize={5}>{currentUser.username}</Title>
        </Center>
      </Box>

      <Box>
        <AutoCenter>
          {currentUser.firstName && currentUser.lastName && (
            <Subtitle isSize={5} style={{ textAlign: 'center' }}>
              {currentUser.firstName + ' ' + currentUser.lastName}
            </Subtitle>
          )}
          {currentUser.bio && (
            <Text fontSize="md" textAlign="center">
              {currentUser.bio}
            </Text>
          )}
        </AutoCenter>
      </Box>

      <Box py="4">
        <Subtitle isSize={6} style={{ color: '#656565', marginBottom: 4, textAlign: 'center' }}>
          reads in:
        </Subtitle>
        <Stack direction="row" justify="center" wrap="wrap">
          {currentUser?.languages?.map((language) => (
            <Tag key={language.value} color="primary" fill="outline" style={{ fontSize: '12px' }}>
              {language.label.toUpperCase()}{' '}
            </Tag>
          ))}
        </Stack>
      </Box>

      <Box p="4">
        <Button block color="primary" onClick={() => setIsEditDialogOpen(true)}>
          Edit
        </Button>
      </Box>

      <Popup
        closable
        bodyStyle={{
          minHeight: '100vh',
          maxHeight: '100vh',
          overflow: 'scroll',
          padding: 12,
        }}
        position="bottom"
        title="Edit Your Profile"
        visible={currentUser && isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <Flex justify="space-between" mb="4">
          <Heading size="md" fontWeight="normal">
            Edit profile
          </Heading>
          <CloseOutline fontSize="24px" onClick={() => setIsEditDialogOpen(false)} />
        </Flex>
        <EditProfile currentUser={currentUser} />
      </Popup>

      <AppTabBar />
    </div>
  );
}

export default Profile;
