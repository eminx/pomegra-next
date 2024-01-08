import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const MessagesCollection = new Mongo.Collection('messages');

MessagesCollection.schema = new SimpleSchema({
  _id: Schemas.Id,
  borrowerId: Schemas.Id,
  isNotificationOn: { type: Boolean, optional: true },
  isSeenByOther: { type: Boolean, optional: true },
  lastMessageBy: { type: String, optional: true },
  lenderId: Schemas.Id,
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
  requestId: Schemas.Id,
});

MessagesCollection.attachSchema(MessagesCollection.schema);

export default MessagesCollection;
