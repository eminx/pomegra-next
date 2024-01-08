import { Meteor } from 'meteor/meteor';
import BooksCollection from '../../books/book';

Meteor.publish('myBooks', function () {
  const userId = this.userId;
  if (userId) {
    return BooksCollection.find({ ownerId: userId });
  }
});
