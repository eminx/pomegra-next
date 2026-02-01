import { Meteor } from 'meteor/meteor';
import BooksCollection from '../../books/book';
import { getNearbyUsersOrBooks } from '../../_utils/functions';

Meteor.methods({
  getUserBooks: async (username) => {
    try {
      const books = await BooksCollection.find({
        ownerUsername: username,
      }).fetchAsync();
      return books;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getMyBooks: async () => {
    const currentUser = await Meteor.userAsync();
    const currentUserId = currentUser._id;

    try {
      return await BooksCollection.find({
        ownerId: currentUserId,
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getSingleBook: async (bookId) => {
    try {
      return await BooksCollection.findOneAsync({
        _id: bookId,
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getDiscoverBooks: async () => {
    const currentUser = await Meteor.userAsync();
    const currentUserId = currentUser?._id;

    try {
      if (currentUserId) {
        return await BooksCollection.find(
          {
            ownerId: { $ne: currentUserId },
            onRequest: { $ne: true },
            isAvailable: true,
          },
          { limit: 50 }
        ).fetchAsync();
      } else {
        return await BooksCollection.find({}, { limit: 50 }).fetchAsync();
      }
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  insertBook: async (book) => {
    const user = await Meteor.userAsync();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const bookExists = await BooksCollection.findOneAsync({
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

    try {
      const bookId = await BooksCollection.insertAsync(newBook);
      return bookId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  insertBookManually: async (book) => {
    const user = await Meteor.userAsync();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const bookExists = await BooksCollection.findOneAsync({
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

    try {
      const bookId = await BooksCollection.insertAsync(newBook);
      return bookId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  updateBook: async (bookId, values) => {
    const user = await Meteor.userAsync();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const theBook = await BooksCollection.findOneAsync(bookId);
    if (theBook.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      await BooksCollection.updateAsync(
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

  removeBook: async (bookId) => {
    const user = await Meteor.userAsync();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const theBook = await BooksCollection.findOneAsync(bookId);
    if (theBook.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      await BooksCollection.removeAsync({ _id: bookId });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getAllBooks: async () => {
    return await BooksCollection.find({
      isAvailable: true,
    }).fetchAsync();
  },

  getBooksNearBy: async () => {
    const user = await Meteor.userAsync();
    if (!user || !user.location) {
      return;
    }

    const radius = 100; //km

    const allBooksRetrieved = await BooksCollection.find({
      ownerId: { $ne: user._id },
      isAvailable: true,
    }).fetchAsync();

    const allBooks = allBooksRetrieved.map((b) => ({
      ...b,
      latitude: b.ownerLocation?.coords.latitude,
      longitude: b.ownerLocation?.coords.longitude,
    }));

    const userLocationCoords = user?.location?.coords;

    return getNearbyUsersOrBooks(
      userLocationCoords.latitude,
      userLocationCoords.longitude,
      radius,
      allBooks
    );
  },
});
