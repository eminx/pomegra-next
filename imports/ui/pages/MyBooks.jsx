import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, NavBar, Picker, SearchBar } from 'antd-mobile';
import { Button, Title, Subtitle } from 'bloomer';
import { Box, Center, Flex, Image } from '@chakra-ui/react';

import Anchor from '../components/Anchor';
import AppTabBar from '../components/AppTabBar';

const ListItem = List.Item;

const sortByMethods = [
  'last added',
  'book title',
  'book author',
  'book language',
  'request condition',
];

function MyShelf() {
  const [books, setBooks] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState('last added');
  const [isLoading, setIsLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Meteor.call('getMyBooks', (error, respond) => {
      setBooks(respond);
      setIsLoading(false);
    });
  }, []);

  const getBooksSorted = () => {
    if (!books || books.length === 0) {
      return;
    }

    switch (sortBy) {
      case 'book title':
        return books.sort((a, b) => a.title && a.title.localeCompare(b.title));
      case 'book author':
        return books.sort(
          (a, b) => a.authors && b.authors && a.authors[0].localeCompare(b.authors[0])
        );
      case 'request condition':
        return books.sort(
          (a, b) =>
            b.onRequest - a.onRequest || b.onAcceptance - a.onAcceptance || b.onLend - a.onLend
        );
      case 'language':
        return books.sort((a, b) => a.language.localeCompare(b.language));
      default:
        return books.sort((a, b) => b.dateAdded - a.dateAdded);
    }
  };

  const getBooksFiltered = (sortedBooks) => {
    return sortedBooks.filter((book) => {
      return (
        (book.title && book.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1) ||
        (book.authors &&
          book.authors.find((author) => {
            return author && author.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
          })) ||
        (book.category && book.category.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)
      );
    });
  };

  const sortedBooks = getBooksSorted();
  const filteredSortedBooks = sortedBooks && getBooksFiltered(sortedBooks);

  return (
    <>
      <NavBar backArrow={false}>My Shelf</NavBar>

      <Center py="4">
        <Link to="/add">
          <Button isColor="light" isLink isOutlined className="is-rounded">
            Add Book
          </Button>
        </Link>
      </Center>

      <Box px="4">
        <SearchBar
          placeholder="Filter"
          cancelText="Cancel"
          onChange={(value) => setFilterValue(value)}
          onClear={() => setFilterValue('')}
          style={{ '--background': '#fff', touchAction: 'none' }}
        />
      </Box>

      <Center mb="4">
        <Anchor label="sorted by" style={{ marginTop: 12 }} onClick={() => setPickerVisible(true)}>
          {sortBy}
        </Anchor>
      </Center>

      <Picker
        cancelText="Cancel"
        columns={[
          sortByMethods.map((method) => ({
            value: method,
            label: method,
          })),
        ]}
        confirmText="Confirm"
        title="Sort by"
        value={sortBy}
        visible={pickerVisible}
        onConfirm={(value) => setSortBy(value[0])}
        onClose={() => setPickerVisible(false)}
      />

      {filteredSortedBooks ? (
        <List style={{ marginBottom: 80 }}>
          {filteredSortedBooks.map((book) => (
            <ListItem
              key={book._id}
              extra={
                <Box maxWidth="80px" textAlign="right" fontSize="12px" overflowWrap="normal">
                  {book.category}
                </Box>
              }
              onClick={() => navigate(`/my-shelf/${book._id}`)}
            >
              <Flex>
                <Image mr="4" bg="purple.50" fit="contain" w="48px" src={book.imageUrl} />
                <Box fontSize=".9em">
                  <b>{book.title}</b>
                  {book.authors?.map((author) => (
                    <div key={author}>{author}</div>
                  ))}
                </Box>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        isLoading && <div>Loading your books...</div>
      )}

      {books && books.length === 0 && (
        <Box>
          <Title isSize={4} hasTextAlign="centered">
            No books
          </Title>
          <Subtitle isSize={6} hasTextAlign="centered">
            You don't have any books in your shelf yet. Please add new books
          </Subtitle>
        </Box>
      )}

      <AppTabBar />
    </>
  );
}

export default MyShelf;
