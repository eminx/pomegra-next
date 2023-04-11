import React from "react";
import { Button, Card, Divider } from "antd-mobile";
import { Table } from "bloomer";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";

import { parseAuthors } from "../../api/_utils/functions";

const BookCard = ({ book, onButtonClick, buttonType, buttonText }) => (
  <Card>
    {/* <BookTitle book={book} /> */}
    <Flex justify="start" align="start" style={{ paddingTop: 8 }}>
      <img
        src={book.imageUrl}
        alt={book.title}
        style={{ maxWidth: "50%", flexGrow: 1, marginRight: 12 }}
      />

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
            <td>{book.language}</td>
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
        </tbody>
      </Table>
    </Flex>
    <Box py="4">
      <Text fontSize="sm">{book.description}</Text>
    </Box>

    <Divider />

    <Center>
      <Button
        color="primary"
        fill="none"
        type={buttonType}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </Center>
  </Card>
);

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

const LightSpan = ({ children }) => (
  <span style={{ color: "#888" }}>{children}</span>
);

export { BookCard, BookTitle, LightSpan };
