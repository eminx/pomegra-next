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
  'industryIdentifiers.$.type': { type: String, optional: true },
  'industryIdentifiers.$.identifier': { type: String, optional: true },
  language: { type: String, optional: true },
  ownerId: Schemas.Id,
  ownerImage: { type: String, optional: true },
  ownerLocation: { type: Object, optional: true },
  'ownerLocation.coords': { type: Object, optional: true },
  'ownerLocation.coords.speed': { type: Number, optional: true },
  'ownerLocation.coords.longitude': { type: Number, optional: true },
  'ownerLocation.coords.latitude': { type: Number, optional: true },
  'ownerLocation.coords.accuracy': { type: Number, optional: true },
  'ownerLocation.coords.heading': { type: Number, optional: true },
  'ownerLocation.coords.altitude': { type: Number, optional: true },
  'ownerLocation.coords.altitudeAccuracy': { type: Number, optional: true },
  'ownerLocation.timestamp': { type: Number, optional: true },
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
