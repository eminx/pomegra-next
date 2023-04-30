import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoCenter, Button, List, NavBar, Popup, Tag } from 'antd-mobile';
import { Avatar, Box, Center, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { Subtitle } from 'bloomer';
import { CloseOutline } from 'antd-mobile-icons';

import EditProfile from '../components/EditProfile';
import AppTabBar from '../components/AppTabBar';
import { call, errorDialog, successDialog } from '../../api/_utils/functions';
import { UserContext } from '../Layout';

const ListItem = List.Item;

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

  const { username } = useParams();
  const navigate = useNavigate();
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

  const { books, user, isBookDialogOpen, isEditDialogOpen, isLoading } = state;

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

      <Box p="2">
        <Center>
          {user.images && user.images.length > 0 ? (
            <Image height="240px" src={user.images[0]} {...imageProps} />
          ) : (
            <Avatar size="2xl" name={user.username} {...imageProps} />
          )}
        </Center>

        {/* <Center pt="2">
          <Title isSize={5}>{user.username}</Title>
        </Center> */}
      </Box>

      <Box>
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
      </Box>

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

      <Box py="2">
        <Heading size="md" textAlign="center" mb="2" fontWeight="light">
          Shelf
        </Heading>
        {books && (
          <List style={{ marginBottom: 80 }}>
            {books.map((book) => (
              <ListItem
                key={book._id}
                extra={
                  <Box maxWidth="80px" textAlign="right" fontSize="12px" overflowWrap="normal">
                    {book.category}
                  </Box>
                }
                onClick={() => navigate(`/book/${book._id}?backToUser=true`)}
              >
                <Flex w="100%" fontSize="0.9em">
                  <Image mr="4" bg="purple.50" fit="contain" w="48px" src={book.imageUrl} />
                  <Box>
                    <Text>
                      <b>{book.title}</b>
                    </Text>
                    <Text>
                      {book.authors &&
                        book.authors.map((author) => <div key={author}>{author}</div>)}
                    </Text>
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
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
