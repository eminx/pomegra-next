import React from 'react';
import { Field, Control, Input, Button } from 'bloomer';
import { Divider } from 'antd-mobile';
import { FadeInUp } from 'animate-components';
import { Flex } from '@chakra-ui/react';

import HeroSlide from '../../components/HeroSlide';
import BookCardNext from '../../components/BookCardNext';

const getTextForLastSlide = (insertedBooks) => {
  switch (insertedBooks) {
    case 0:
      return 'Please search for a book to add';
    case 1:
      return 'Great! We need to have two more books from your shelf.';
    case 2:
      return 'Amazing! You are almost done! Only one left to start using...';
    case 3:
      return 'Well done! You may continue filling up your virtual shelf, or start discovering';
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
  onAddButtonClick,
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
                display: 'inline',
              }}
            >
              {/* <ActivityIndicator animating={isSearching} /> */}
            </div>
          </Control>
        </Field>

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

    {/* <Divider /> */}

    <div style={{ paddingTop: 24 }}>
      {searchResults &&
        searchResults.map((result, index) => (
          <FadeInUp key={result.id} duration=".5s" timingFunction="ease">
            <BookCardNext
              isDark
              isIntro
              volumeInfo={result.volumeInfo}
              onClickBook={() => onClickBook(index)}
              isOpen={openBook === index}
              buttonText="Add to My Shelf"
              onButtonClick={() => onAddButtonClick(result.volumeInfo)}
            />
          </FadeInUp>
        ))}
    </div>

    {/* <Divider /> */}

    <div>
      {insertedBooks === 3 && (
        <Flex justify="center">
          <Button isColor="success" isSize="large" onClick={onButtonClick}>
            Start Discovering
          </Button>
        </Flex>
      )}
    </div>
  </HeroSlide>
);

export default BookInserter;
