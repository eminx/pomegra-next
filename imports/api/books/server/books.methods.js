import { Meteor } from 'meteor/meteor';
import { BooksCollection } from '../../collections';

Meteor.methods({
  getMyBooks: () => {
    const currentUserId = Meteor.userId();
    try {
      const myBooks = BooksCollection.find({ ownerId: currentUserId }).fetch();
      return myBooks;
    } catch (error) {
      return error;
    }
  },

  getMyBook: (bookId) => {
    const currentUserId = Meteor.userId();

    try {
      return BooksCollection.findOne({
        _id: bookId,
        ownerId: currentUserId,
      });
    } catch (error) {
      return error;
    }
  },

  getSingleBook: (bookId) => {
    try {
      return BooksCollection.findOne({
        _id: bookId,
      });
    } catch (error) {
      return error;
    }
  },

  getDiscoverBooks: () => {
    const currentUserId = Meteor.userId();
    try {
      if (currentUserId) {
        return BooksCollection.find(
          {
            ownerId: { $ne: currentUserId },
          },
          { limit: 50 }
        ).fetch();
      } else {
        return BooksCollection.find({}, { limit: 50 }).fetch();
      }
    } catch (error) {
      return error;
    }
  },

  insertBook: (book) => {
    const user = Meteor.user();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const bookExists = BooksCollection.findOne({
      title: book.title,
      ownerId: currentUserId,
    });

    if (bookExists) {
      throw new Meteor.Error('You have already added a book with same title');
    }

    let imageUrl = book.imageLinks && (book.imageLinks.thumbnail || book.imageLinks.smallThumbnail);

    if (imageUrl && imageUrl.substring(0, 5) === 'http:') {
      imageUrl = imageUrl.slice(0, 4) + 's' + imageUrl.slice(4);
    }

    const newBook = {
      ...book,
      category: book.categories ? book.categories[0] : '',
      titleLowerCase: book.title && book.title.toLowerCase(),
      authorsLowerCase:
        book.authors &&
        book.authors.length > 0 &&
        book.authors.map((author) => author.toLowerCase()),
      ISBN: book.industryIdentifiers && book.industryIdentifiers[1]?.identifier,
      imageUrl,
      ownerId: currentUserId,
      ownerUsername: user.username,
      ownerImage: user.images[0],
      xTimes: 0,
      isAvailable: true,
      dateAdded: new Date(),
    };

    const bookId = BooksCollection.insert(newBook, function (error, result) {
      if (error) {
        console.log('error!', error);
        throw new Meteor.error(error);
      } else {
        return bookId;
      }
    });
  },

  insertBookManually: (book) => {
    const user = Meteor.user();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const bookExists = BooksCollection.findOne({
      title: book.title,
      ownerId: currentUserId,
    });

    if (bookExists) {
      throw new Meteor.Error('You have already added a book with same title');
    }

    const newBook = {
      ...book,
      ownerId: currentUserId,
      ownerUsername: user.username,
      ownerImage: user.images && user.images[0],
      xTimes: 0,
      isAvailable: true,
      dateAdded: new Date(),
    };

    const bookId = BooksCollection.insert(newBook, function (error, result) {
      if (error) {
        console.log('error!', error);
        throw new Meteor.error(error);
      } else {
        return bookId;
      }
    });
  },

  updateBook: (bookId, values) => {
    if (!Meteor.userId()) {
      return;
    }
    const theBook = BooksCollection.findOne(bookId);
    if (theBook.ownerId !== Meteor.userId()) {
      return;
    }
    try {
      BooksCollection.update(
        { _id: bookId },
        {
          $set: {
            ...values,
          },
        }
      );
    } catch (error) {
      return error;
    }
  },

  removeBook: (bookId) => {
    if (!Meteor.userId()) {
      return;
    }
    const theBook = BooksCollection.findOne(bookId);
    if (theBook.ownerId !== Meteor.userId()) {
      return;
    }

    try {
      BooksCollection.remove({ _id: bookId });
    } catch (error) {
      return error;
    }
  },
});
