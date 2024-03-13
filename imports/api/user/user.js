import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';

const Users = Meteor.users;

Users.schema = {};
Users.schema.AccountBase = {
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  emails: { type: Array },
  'emails.$': { type: Object },
  'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
  'emails.$.verified': { type: Boolean },
  username: { type: String, min: 3, max: 21 },
  createdAt: { type: Date },
  services: { type: Object, blackbox: true },
};

Users.schema.UserProfile = {
  bio: { type: String, defaultValue: '', optional: true },
  blockedUsers: { type: Array, optional: true },
  'blockedUsers.$': { type: String },
  firstName: { type: String, defaultValue: '', optional: true },
  lastName: { type: String, defaultValue: '', optional: true },
  images: { type: Array, defaultValue: [], optional: true },
  'images.$': { type: String, optional: true },
  isReported: { type: Boolean, optional: true },
  languages: { type: Array, optional: true },
  'languages.$': { type: Object },
  'languages.$.label': { type: String },
  'languages.$.value': { type: String },
  location: {
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
  notifications: { type: Array, defaultValue: [] },
  'notifications.$': {
    type: new SimpleSchema({
      context: { type: String },
      contextId: { type: String },
      count: { type: Number },
      title: { type: String },
      unSeenIndexes: { type: Array, optional: true },
      'unSeenIndexes.$': { type: Number, optional: true },
    }),
    optional: true,
  },
  previousImages: { type: Array, optional: true },
  'previousImages.$': { type: String, optional: true },
};

// Ensuring every user has an email address, should be in server-side code
Accounts.validateNewUser((user) => {
  new SimpleSchema(Users.schema.AccountBase).validate(user);
  // Return true to allow user creation to proceed
  return true;
});

Users.attachSchema(
  new SimpleSchema({
    ...Users.schema.AccountBase,
    ...Users.schema.UserProfile,
  })
);

export default Users;
