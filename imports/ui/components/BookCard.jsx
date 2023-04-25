import React from 'react';
import { Button, Card, Divider } from 'antd-mobile';
import { Table } from 'bloomer';
import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react';

import { parseAuthors } from '../../api/_utils/functions';
import allLanguages from '../../api/_utils/langs/allLanguages';

const BookCard = ({ book }) => {
  const bookLang = allLanguages.find((l) => {
    return l.value === book.language;
  });

  return (
    <Card style={{ boxShadow: 'rgb(255 241 252) 0px 0px 24px 10px' }}>
      {/* <BookTitle book={book} /> */}
      <Flex align="start" justify="start" pt="2">
        <Box maxW="150px" h="180px" bg={book.imageUrl ? '#fff' : 'purple.50'} mr="2">
          {book.imageUrl && (
            <img
              src={book.imageUrl}
              alt={book.title}
              style={{ maxWidth: '150px', flexGrow: 1, marginRight: 12 }}
            />
          )}
        </Box>
        <Table isNarrow style={{ fontSize: 14, flexGrow: 2 }}>
          <tbody>
            <tr>
              <td>
                <LightSpan>title</LightSpan>
              </td>
              <td>{book.title}</td>
            </tr>
            <tr>
              <td>
                <LightSpan>authors</LightSpan>
              </td>
              <td>{book.authors && parseAuthors(book.authors)}</td>
            </tr>
            <tr>
              <td>
                <LightSpan>category</LightSpan>
              </td>
              <td>{book.category}</td>
            </tr>
            <tr>
              <td>
                <LightSpan>languauge</LightSpan>
              </td>
              <td>{bookLang?.label}</td>
            </tr>
            <tr>
              <td>
                <LightSpan>ISBN</LightSpan>
              </td>
              <td>{book.ISBN}</td>
            </tr>
            <tr>
              <td>
                <LightSpan>publisher</LightSpan>
              </td>
              <td>{book.publisher}</td>
            </tr>
            <tr>
              <td>
                <LightSpan>publish date</LightSpan>
              </td>
              <td>{book.publishedDate}</td>
            </tr>
          </tbody>
        </Table>
      </Flex>
      <Box py="8">
        <Text fontSize="sm">{book.description}</Text>
      </Box>
    </Card>
  );
};

const BookTitle = ({ book }) => (
  <Center mb="4">
    <Box>
      <Heading fontWeight="bold" size="lg" textAlign="center">
        {book.title}
      </Heading>
      <Heading fontWeight="normal" size="md" textAlign="center">
        {book.authors && parseAuthors(book.authors)}
      </Heading>
    </Box>
  </Center>
);

const LightSpan = ({ children }) => <span style={{ color: '#888' }}>{children}</span>;

export { BookCard, BookTitle, LightSpan };
