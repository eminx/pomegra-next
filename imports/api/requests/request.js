import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const RequestsCollection = new Mongo.Collection('requests');

RequestsCollection.schema = new SimpleSchema({
  _id: Schemas.Id,
  bookAuthors: { type: Array, optional: true },
  'bookAuthors.$': { type: String, optional: true },
  bookCategories: { type: Array, optional: true },
  'bookCategories.$': { type: String, optional: true },
  bookId: Schemas.Id,
  bookImage: { type: String, optional: true },
  bookLanguage: { type: String, optional: true },
  bookTitle: { type: String },
  dateRequested: { type: Date },
  isConfirmed: { type: Date, optional: true },
  isHanded: { type: Date, optional: true },
  isNotificationOn: { type: Boolean, optional: true },
  isRepliedAndNotSeen: { type: Boolean, optional: true },
  isReturned: { type: Date, optional: true },
  isSeenByOther: { type: Boolean, optional: true },
  lastMessageBy: { type: String, optional: true },
  lastMessageDate: { type: Date, optional: true },
  messages: { type: Array },
  'messages.$': {
    type: new SimpleSchema({
      content: { type: String },
      senderUsername: { type: String },
      senderId: Schemas.Id,
      createdDate: { type: Date },
    }),
  },
  ownerId: Schemas.Id,
  ownerImage: { type: String, optional: true },
  ownerUsername: { type: String },
  requesterId: Schemas.Id,
  requesterImage: { type: String, optional: true },
  requesterUsername: { type: String },
});

RequestsCollection.attachSchema(RequestsCollection.schema);

export default RequestsCollection;
