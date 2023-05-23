import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, NavBar, Skeleton, CapsuleTabs } from 'antd-mobile';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

import AppTabBar from '../components/AppTabBar';
import { call, errorDialog } from '../../api/_utils/functions';
import About from '../components/About';

const ListItem = List.Item;
const { Tab } = CapsuleTabs;

function Discover() {
  const [state, setState] = useState({
    books: null,
    users: null,
    isLoading: true,
    activeTab: 'books',
  });

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const books = await call('getDiscoverBooks');
      const users = await call('getUsers');
      setState({
        ...state,
        books,
        users,
        isLoading: false,
      });
    } catch (error) {
      errorDialog(error);
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  const { books, users, activeTab, isLoading } = state;

  if (isLoading || !books) {
    return (
      <div>
        <NavBar backArrow={false}>Discover</NavBar>
        <Skeleton animated style={{ width: '100%', height: '80px', marginBottom: 24 }} />
        <Skeleton animated style={{ width: '100%', height: '80px', marginBottom: 24 }} />
        <Skeleton animated style={{ width: '100%', height: '80px', marginBottom: 24 }} />
        <Skeleton animated style={{ width: '100%', height: '80px', marginBottom: 24 }} />
      </div>
    );
  }

  return (
    <>
      <NavBar backArrow={false}>Discover</NavBar>

      <Box mb="4">
        <CapsuleTabs onChange={(key) => setState({ ...state, activeTab: key })}>
          <Tab key="books" title="Books" />
          <Tab key="users" title="Users" />
        </CapsuleTabs>
      </Box>

      {activeTab === 'books' && (
        <List>
          {books.map((suggestedBook) => (
            <ListItem
              key={suggestedBook._id}
              extra={
                <Box maxWidth="80px" textAlign="right" fontSize="12px" overflowWrap="normal">
                  {suggestedBook.category}
                </Box>
              }
              onClick={() => navigate(`/book/${suggestedBook._id}`)}
            >
              <Flex w="100%" fontSize="0.9em">
                <Image mr="4" bg="purple.50" fit="contain" w="48px" src={suggestedBook.imageUrl} />
                <Box>
                  <Text>
                    <b>{suggestedBook.title}</b>
                  </Text>
                  <Text>
                    {suggestedBook.authors &&
                      suggestedBook.authors.map((author) => <div key={author}>{author}</div>)}
                  </Text>
                </Box>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}

      {activeTab === 'users' && (
        <Box>
          {users?.map((user) => (
            <Box m="4">
              <Link to={`/${user.username}`}>
                <Box py="2" bg="white">
                  <About user={user} isSmall />
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      )}

      <Box h="48px" />
      <AppTabBar />
    </>
  );
}

export default Discover;
