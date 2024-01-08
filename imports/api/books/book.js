import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const BooksCollection = new Mongo.Collection('books');

BooksCollection.schema = new SimpleSchema({
  _id: Schemas.Id,
  authors: { type: Array },
  'authors.$': { type: String },
  authorsLowerCase: { type: Array },
  'authorsLowerCase.$': { type: String },
  categories: { type: Array, optional: true },
  'categories.$': { type: String, optional: true },
  canonicalVolumeLink: { type: String, optional: true },
  category: { type: String, optional: true },
  dateAdded: { type: Date },
  description: { type: String, optional: true },
  imageLinks: { type: Object, optional: true },
  'imageLinks.smallThumbnail': { type: String, optional: true },
  'imageLinks.thumbnail': { type: String, optional: true },
  imageUrl: { type: String, optional: true },
  isAvailable: { type: Boolean },
  ISBN: { type: String, optional: true },
  industryIdentifiers: { type: Array, optional: true },
  'industryIdentifiers.$': {
    type: new SimpleSchema({
      type: { type: String, optional: true },
      identifier: { type: String, optional: true },
    }),
  },
  language: { type: String, optional: true },
  onRequest: { type: Boolean, optional: true },
  ownerId: Schemas.Id,
  ownerImage: { type: String, optional: true },
  ownerLocation: {
    type: new SimpleSchema({
      coords: {
        type: new SimpleSchema({
          speed: { type: Number, optional: true },
          longitude: { type: Number, optional: true },
          latitude: { type: Number, optional: true },
          accuracy: { type: Number, optional: true },
          heading: { type: Number, optional: true },
          altitude: { type: Number, optional: true },
          altitudeAccuracy: { type: Number, optional: true },
        }),
      },
      timestamp: { type: Number, optional: true },
    }),
    optional: true,
  },
  ownerUsername: { type: String },
  pageCount: { type: Number, optional: true },
  printType: { type: String, optional: true },
  publishedDate: { type: String, optional: true },
  publisher: { type: String, optional: true },
  title: { type: String },
  titleLowerCase: { type: String },
  xTimes: { type: Number },
});

BooksCollection.attachSchema(BooksCollection.schema);

export default BooksCollection;
