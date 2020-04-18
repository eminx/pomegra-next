import React from 'react';
import { Card, Flex, Button } from 'antd-mobile';
import { Title, Subtitle, Heading, Table } from 'bloomer';

const CardHeader = Card.Header;
const CardBody = Card.Body;
const CardFooter = Card.Footer;

import { parseAuthors } from '../functions';

const BookCard = ({
  book,
  onButtonClick,
  buttonType,
  buttonText,
}) => (
  <Card>
    <CardHeader title={<BookTitle book={book} />} />
    <CardBody>
      <p>{book.description || book.b_description}</p>
    </CardBody>
    <CardFooter
      content={
        <Button type={buttonType} onClick={onButtonClick}>
          {buttonText}
        </Button>
      }
    />
  </Card>
);

const BookTitle = ({ book }) => (
  <div style={{ width: '100%' }}>
    <Title isSize={5} hasTextAlign="centered">
      {book.title || book.b_title}
    </Title>
    <Subtitle isSize={5} hasTextAlign="centered">
      {book.authors ? parseAuthors(book.authors) : book.b_author}
    </Subtitle>

    <Flex justify="start" align="start" style={{ paddingTop: 8 }}>
      <img
        src={book.image_url}
        alt={book.b_title}
        style={{ maxHeight: 140, flexGrow: 0, marginRight: 12 }}
      />

      <Table isNarrow style={{ fontSize: 14 }}>
        <tbody>
          <tr>
            <td>
              <LightSpan>category</LightSpan>
            </td>
            <td>
              {(book.categories && book.categories[0]) || book.b_cat}
            </td>
          </tr>
          <tr>
            <td>
              <LightSpan>languauge</LightSpan>
            </td>
            <td>{book.language || book.b_lang}</td>
          </tr>
        </tbody>
      </Table>
    </Flex>
  </div>
);

const LightSpan = ({ children }) => (
  <span style={{ color: '#888' }}>{children}</span>
);

export { BookCard, BookTitle, LightSpan };
