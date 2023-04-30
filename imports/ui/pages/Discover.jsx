import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, List } from 'antd-mobile';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import AppTabBar from '../components/AppTabBar';

const ListItem = List.Item;

function Discover() {
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.call('getDiscoverBooks', (error, respond) => {
      if (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
      setBooks(respond);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  }

  // if (!books || books.length === 0) {
  //   // return <ActivityIndicator toast text="Loading..." />;
  //   return null;
  // }

  return (
    <>
      <NavBar backArrow={false}>Discover Books</NavBar>
      {books && books.length > 0 && (
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

      <AppTabBar />
    </>
  );
}

export default Discover;
