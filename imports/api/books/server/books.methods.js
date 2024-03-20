import { Meteor } from 'meteor/meteor';
import BooksCollection from '../../books/book';
import { getNearbyUsersOrBooks } from '../../_utils/functions';

Meteor.methods({
  getUserBooks: (username) => {
    try {
      const books = BooksCollection.find({ ownerUsername: username }).fetch();
      return books;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getMyBooks: () => {
    const currentUserId = Meteor.userId();
    try {
      const myBooks = BooksCollection.find({ ownerId: currentUserId }).fetch();
      return myBooks;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getSingleBook: (bookId) => {
    try {
      return BooksCollection.findOne({
        _id: bookId,
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getDiscoverBooks: () => {
    const currentUserId = Meteor.userId();
    try {
      if (currentUserId) {
        return BooksCollection.find(
          {
            ownerId: { $ne: currentUserId },
            onRequest: { $ne: true },
            isAvailable: true,
          },
          { limit: 50 }
        ).fetch();
      } else {
        return BooksCollection.find({}, { limit: 50 }).fetch();
      }
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
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

    let imageUrl =
      book.imageLinks &&
      (book.imageLinks.thumbnail || book.imageLinks.smallThumbnail);

    if (imageUrl && imageUrl.substring(0, 5) === 'http:') {
      imageUrl = imageUrl.slice(0, 4) + 's' + imageUrl.slice(4);
    }

    const newBook = {
      authors: book.authors,
      authorsLowerCase:
        book.authors &&
        book.authors.length > 0 &&
        book.authors.map((author) => author.toLowerCase()),
      canonicalVolumeLink: book.canonicalVolumeLink,
      categories: book.categories,
      category: book.categories ? book.categories[0] : '',
      dateAdded: new Date(),
      description: book.description,
      imageLinks: book.imageLinks,
      imageUrl,
      isAvailable: true,
      ISBN: book.industryIdentifiers && book.industryIdentifiers[1]?.identifier,
      language: book.language,
      publisher: book.publisher,
      ownerId: currentUserId,
      ownerUsername: user.username,
      ownerImage: user.images && user.images[0],
      ownerLocation: user.location,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      printType: book.printType,
      title: book.title,
      titleLowerCase: book.title && book.title.toLowerCase(),
      xTimes: 0,
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
      throw new Meteor.Error('You are not the owner!');
    }
    try {
      BooksCollection.update(
        { _id: bookId },
        {
          $set: {
            ...values,
            dateUpdatedLast: new Date(),
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  removeBook: (bookId) => {
    if (!Meteor.userId()) {
      return;
    }
    const theBook = BooksCollection.findOne(bookId);
    if (theBook.ownerId !== Meteor.userId()) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      BooksCollection.remove({ _id: bookId });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getAllBooks: () => {
    const books = BooksCollection.find({
      isAvailable: true,
    }).fetch();

    return books;
  },

  getBooksNearBy: () => {
    const user = Meteor.user();
    if (!user || !user.location) {
      return;
    }

    const radius = 100; //km

    const allBooks = BooksCollection.find({
      ownerId: { $ne: user._id },
      isAvailable: true,
    })
      .fetch()
      .map((b) => ({
        ...b,
        latitude: b.ownerLocation?.coords.latitude,
        longitude: b.ownerLocation?.coords.longitude,
      }));

    const userLocationCoords = user.location.coords;

    return getNearbyUsersOrBooks(
      userLocationCoords.latitude,
      userLocationCoords.longitude,
      radius,
      allBooks
    );
  },
});
