import React from 'react';
import { Field, Control, Input, Button, Flex } from 'bloomer';
import { WhiteSpace, ActivityIndicator } from 'antd-mobile';
import { FadeInUp } from 'animate-components';

import HeroSlide from '../../reusables/HeroSlide';
import BookCardNext from '../../reusables/BookCardNext';

const getTextForLastSlide = insertedBooks => {
  switch (insertedBooks) {
    case 0:
      return 'Please search for a book to add';
    case 1:
      return 'Great! We need to have two more books from your shelf.';
    case 2:
      return 'Amazing! You are almost done! Only one left to start using...';
    case 3:
      return 'Well done! You may continue filling up your virtual shelf, or do it later';
  }
};

const BookInserter = ({
  isSearching,
  openBook,
  searchValue,
  insertedBooks,
  searchResults,
  onSearch,
  onSearchValueChange,
  onClickBook,
  onButtonClick,
  onAddButtonClick
}) => (
  <HeroSlide
    subtitle={getTextForLastSlide(insertedBooks)}
    isColor={searchResults ? 'white' : 'dark'}
    hasTextColor="light"
  >
    <div>
      <form onSubmit={onSearch}>
        <Field>
          <Control style={{ position: 'relative' }}>
            <Input
              type="test"
              placeholder="book title, author, ISBN etc"
              value={searchValue}
              onChange={onSearchValueChange}
              className="is-rounded"
              hasTextColor="dark"
            />
            <div
              style={{
                position: 'absolute',
                right: 12,
                top: 10,
                display: 'inline'
              }}
            >
              <ActivityIndicator animating={isSearching} />
            </div>
          </Control>
        </Field>
        {/* <Help isColor={isPasswordInvalid ? 'warning' : 'success'}>
                  {isPasswordInvalid ? 'not strong enought' : 'looks great'}
                </Help> */}

        {!searchResults ||
          (searchResults.length === 0 && (
            <Field>
              <Control>
                <Button
                  onClick={onSearch}
                  className="is-rounded"
                  isPulled="right"
                  isColor="white"
                  isOutlined
                  hasTextColor="white"
                  // style={{ borderColor: '#f6f6f6' }}
                  isLoading={isSearching}
                >
                  Search
                </Button>
              </Control>
            </Field>
          ))}
      </form>
    </div>

    <WhiteSpace />
    <div style={{ paddingTop: 24 }}>
      {searchResults &&
        searchResults.map((result, index) => (
          <FadeInUp key={result.id} duration=".5s" timingFunction="ease">
            <BookCardNext
              volumeInfo={result.volumeInfo}
              openBook={() => onClickBook(index)}
              isOpen={openBook === index}
              onAddButtonClick={() => onAddButtonClick(result.volumeInfo)}
            />
            >
          </FadeInUp>
        ))}
    </div>

    {insertedBooks === 3 && (
      <Flex justify="center" direction="column">
        <Button isColor="success" isSize="large" onClick={onButtonClick}>
          Start using
        </Button>
      </Flex>
    )}
  </HeroSlide>
);

export default BookInserter;
