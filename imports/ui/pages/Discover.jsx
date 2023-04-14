import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, List } from 'antd-mobile';
import AppTabBar from '../components/AppTabBar';

const ListItem = List.Item;

function Discover() {
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div name="books">
      <NavBar backArrow={false}>Lend Books</NavBar>
      {books && books.length > 0 && (
        <List renderHeader={() => 'Suggested books for you'}>
          {books.map((suggestedBook) => (
            <ListItem
              key={suggestedBook._id}
              align="top"
              thumb={<img style={{ width: 33, height: 44 }} src={suggestedBook.imageUrl} />}
              multipleLine
              extra={suggestedBook.category}
            >
              <Link to={`/book/${suggestedBook._id}`}>
                <b>{suggestedBook.title}</b>
                {suggestedBook.authors &&
                  suggestedBook.authors.map((author) => <div key={author}>{author}</div>)}
              </Link>
            </ListItem>
          ))}
        </List>
      )}

      <AppTabBar />
    </div>
  );
}

export default Discover;
