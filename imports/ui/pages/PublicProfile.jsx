import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoCenter, List, NavBar, Tag } from 'antd-mobile';
import { Avatar, Box, Center, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { Title, Subtitle } from 'bloomer';

import AppTabBar from '../components/AppTabBar';
import { call } from '../../api/_utils/functions';

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
    isLoading: true,
  });
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const user = await call('getUserProfile', username);
      const books = await call('getUserBooks', username);
      console.log(books);
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

  const { books, user, isLoading } = state;

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

      <Box py="2">
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

      <Box py="2">
        <Heading size="md" textAlign="center">
          Books
        </Heading>
        {books && (
          <List style={{ marginBottom: 80 }}>
            {books.map((book) => (
              <ListItem
                key={book._id}
                extra={book.category}
                onClick={() => navigate(`/book/${book._id}`)}
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

      <AppTabBar />
    </div>
  );
}

export default PublicProfile;
