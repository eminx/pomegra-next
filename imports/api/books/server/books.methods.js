import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import BooksCollection from '../../books/book';
import { getNearbyUsersOrBooks } from '../../_utils/functions';

const googleBooksApiKey = Meteor.settings.googleBooksApiKey;
const googleApi = `https://www.googleapis.com/books/v1/volumes?key=${googleBooksApiKey}&q=`;

const fetchBooks = async (query) => {
  check(query, String);

  if (query.trim().length < 3) {
    throw new Meteor.Error(
      'invalid-query',
      'Query must be at least 3 characters.'
    );
  }

  const url = googleApi + encodeURIComponent(query);

  const maxRetries = 3;
  let delay = 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (
          (response.status === 429 || response.status >= 500) &&
          attempt < maxRetries
        ) {
          console.warn(
            `[books.search] Status ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw new Meteor.Error(
          'google-books-error',
          `Google Books API responded with status ${response.status}`
        );
      }

      const data = await response.json();
      return (data?.items || []).map((item) => item.volumeInfo);
    } catch (err) {
      if (err instanceof Meteor.Error) throw err;

      if (attempt >= maxRetries) {
        console.error('[books.search] Failed after retries:', err);
        throw new Meteor.Error(
          'google-books-failed',
          err.message || 'Search failed'
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  return [];
};

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
    const currentUser = await Meteor.userAsync();

    const allBooksAvailable = await BooksCollection.find({
      isAvailable: true,
      ownerUsername: {
        $nin: [...currentUser.blockedUsers, currentUser.username],
      },
    }).fetchAsync();

    if (!currentUser || !currentUser.locationSearchEnabled) {
      return allBooksAvailable;
    }

    const radius = currentUser.locationSearchRadius || 100;
    const allBooksAround = allBooksAvailable.map((b) => ({
      ...b,
      latitude: b.ownerLocation?.coords.latitude,
      longitude: b.ownerLocation?.coords.longitude,
    }));

    const userLocationCoords = currentUser?.location?.coords;

    return getNearbyUsersOrBooks(
      userLocationCoords.latitude,
      userLocationCoords.longitude,
      radius,
      allBooksAround
    );
  },

  async 'books.search'(query) {
    return fetchBooks(query);
  },
});
