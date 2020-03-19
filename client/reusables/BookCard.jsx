import React from 'react';
import { Card, Flex, Button } from 'antd-mobile';

const CardHeader = Card.Header;
const CardBody = Card.Body;
const CardFooter = Card.Footer;

const BookCard = ({ book, onButtonClick, buttonType, buttonText }) => (
  <Card>
    <CardHeader title={<BookTitle book={book} />} />
    <CardBody>
      <p>{book.b_description}</p>
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
    <h3 style={{ textAlign: 'center', marginBottom: 0 }}>{book.b_title}</h3>
    <p style={{ textAlign: 'center', marginTop: 8 }}>
      by <em>{book.b_author}</em>
    </p>
    <Flex justify="between" align="start" style={{ paddingTop: 8 }}>
      <img
        src={book.image_url}
        alt={book.b_title}
        style={{ maxHeight: 140, flexGrow: 0 }}
      />
      <div style={{ paddingLeft: 12, paddingRight: 12 }}>
        <div style={{ textAlign: 'right' }}>
          {/* <p style={{ marginTop: 0 }}> */}
          {/* <LightSpan>author</LightSpan> {book.b_author} */}
          {/* </p> */}
          <p style={{ marginTop: 0 }}>
            <LightSpan>category</LightSpan>
            {book.b_cat}
          </p>
          <p style={{ marginTop: 0 }}>
            <LightSpan>language</LightSpan>
            {book.b_lang}
          </p>
        </div>
      </div>
    </Flex>
  </div>
);

const LightSpan = ({ children }) => (
  <span style={{ color: '#888', fontSize: 14 }}>
    <b>{children}</b>
    <br />
  </span>
);

export { BookCard, BookTitle, LightSpan };
