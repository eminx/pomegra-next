import { Slingshot } from 'meteor/edgee:slingshot';
const s3Settings = Meteor.settings.AWSs3;

Slingshot.fileRestrictions('profileImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective('profileImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function () {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function (file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  },
});

Slingshot.fileRestrictions('bookImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective('bookImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function () {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function (file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  },
});
