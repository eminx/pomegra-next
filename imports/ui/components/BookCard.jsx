import React from 'react';
import { Button, Card } from 'antd-mobile';
import { Table } from 'bloomer';
import { Box, Center, Flex, Heading, Image, Text, useMediaQuery } from '@chakra-ui/react';

import { parseAuthors } from '../../api/_utils/functions';
import allLanguages from '../../api/_utils/langs/allLanguages';

const cardStyle = { boxShadow: 'rgb(255 241 252) 0px 0px 24px 10px' };

function BookCard({ book, buttonLabel, onButtonClick }) {
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');

  const bookLang = allLanguages.find((l) => {
    return l.value === book.language;
  });

  return (
    <Card>
      {/* <BookTitle book={book} /> */}
      <Flex align="start" flexDirection={isLargerThan600 ? 'row' : 'column'} justify="start" pt="2">
        <Center
          bg={book.imageUrl ? '#fff' : 'purple.50'}
          flexShrink="2"
          justifyContent="center"
          maxH="180px"
          mr="2"
          mb="4"
          w={isLargerThan600 ? 'auto' : '100%'}
        >
          {book.imageUrl && (
            <Image
              src={book.imageUrl}
              alt={book.title}
              style={{ maxWidth: '120px', flexGrow: 1, marginRight: 12 }}
            />
          )}
        </Center>
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

      <Box py="4">
        <Button color="primary" block onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </Box>

      <Box>
        <Text fontSize="sm">{book.description}</Text>
      </Box>
    </Card>
  );
}

function BookTitle({ book }) {
  return (
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
}

function LightSpan({ children }) {
  return <span style={{ color: '#888' }}>{children}</span>;
}

export { BookCard, BookTitle, LightSpan };
