import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import BooksCollection from '../../books/book';
import { getNearbyUsersOrBooks } from '../../_utils/functions';

const fields = [
  'key',
  'title',
  'subtitle',
  'author_name',
  'author_key',
  'publisher',
  'first_publish_year',
  'number_of_pages_median',
  'subject',
  'language',
  'first_sentence',
  'isbn',
  'cover_i',
  'cover_edition_key',
  'edition_count',
  'ebook_access',
  'ratings_average',
  'ratings_count',
  'want_to_read_count',
].join(',');

// const booksApiKey = Meteor.settings.booksApiKey;
const booksApi = `https://openlibrary.org/search.json?q=`;
const options = {
  headers: {
    'User-Agent': 'Librella (info@librella.app)',
  },
};
const extraParams = `&limit=20&fields=${fields}`;

const fetchBooks = async (query) => {
  check(query, String);

  if (query.trim().length < 3) {
    throw new Meteor.Error(
      'invalid-query',
      'Query must be at least 3 characters.'
    );
  }

  const url = booksApi + encodeURIComponent(query) + extraParams;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Meteor.Error(
        `Google Books API responded with status ${response.status}`
      );
    }
    const data = await response.json();
    return data?.docs || [];
  } catch (err) {
    if (err instanceof Meteor.Error) throw err;
  }
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

    if (!currentUser) {
      return await BooksCollection.find({
        isAvailable: true,
      }).fetchAsync();
    }

    const blockedUsers = currentUser.blockedUsers ?? [];
    const allBooksAvailable = await BooksCollection.find({
      isAvailable: true,
      ownerUsername: {
        $nin: [...blockedUsers, currentUser.username],
      },
    }).fetchAsync();

    if (!currentUser.locationSearchEnabled) {
      return allBooksAvailable;
    }

    const radius = currentUser.locationSearchRadius || 100;
    const allBooksWithLocation = allBooksAvailable.map((b) => ({
      ...b,
      latitude: b.ownerLocation?.coords.latitude,
      longitude: b.ownerLocation?.coords.longitude,
    }));

    const userLocationCoords = currentUser?.location?.coords;

    return getNearbyUsersOrBooks(
      userLocationCoords.latitude,
      userLocationCoords.longitude,
      radius,
      allBooksWithLocation
    );
  },

  'books.search': async (query) => {
    return fetchBooks(query);
  },
});
