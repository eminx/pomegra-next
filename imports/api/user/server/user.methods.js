import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { RequestsCollection } from '../../collections';

Meteor.methods({
  registerUser: (user) => {
    Accounts.createUser({
      email: user.email,
      username: user.username,
      password: user.password,
    });
  },

  updateProfile: (values) => {
    const currentUser = Meteor.user();
    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
        },
      });
    } catch (error) {
      return error;
    }
  },

  updateLanguages: (languages) => {
    const currentUser = Meteor.user();

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          languages: languages,
        },
      });
    } catch (error) {
      return error;
    }
  },

  createNotification: (contextName, contextId, unSeenIndex) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      if (contextName !== 'request') {
        return;
      }
      const theRequest = RequestsCollection.findOne(contextId);
      const theOthersId =
        theRequest.requesterId === currentUser._id ? theRequest.ownerId : theRequest.requesterId;
      const theOther = Meteor.users.findOne(theOthersId);

      const contextIdIndex = theOther.notifications?.findIndex((notification) => {
        return notification.contextId === contextId;
      });

      if (contextIdIndex === 0 || contextIdIndex !== -1) {
        const notifications = theOther.notifications ? [...theOther.notifications] : [];
        if (notifications[contextIdIndex]) {
          notifications[contextIdIndex].count += 1;
        }
        if (!notifications[contextIdIndex]?.unSeenIndexes) {
          notifications[contextIdIndex].unSeenIndexes = [];
        }
        notifications[contextIdIndex]?.unSeenIndexes.push(unSeenIndex);

        Meteor.users.update(theOthersId, {
          $set: {
            notifications: notifications,
          },
        });
      } else {
        Meteor.users.update(theOthersId, {
          $push: {
            notifications: {
              title: theOther.username,
              count: 1,
              context: contextName,
              contextId: contextId,
              unSeenIndexes: [unSeenIndex],
            },
          },
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  removeNotification: (contextId, messageIndex) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const notifications = [...currentUser.notifications];
      if (!notifications) {
        return;
      }

      const notificationIndex = notifications.findIndex(
        (notification) => notification.contextId === contextId
      );

      if (notificationIndex < 0) {
        return;
      }

      notifications[notificationIndex].count -= 1;

      let newNotifications;
      if (notifications[notificationIndex]?.count === 0) {
        newNotifications = notifications.filter(
          (notification, index) => index !== notificationIndex
        );
      } else {
        const newUnSeenIndexes = notifications[notificationIndex].unSeenIndexes.filter(
          (unSeenIndex) => unSeenIndex !== messageIndex
        );
        notifications[notificationIndex].unSeenIndexes = newUnSeenIndexes;
        newNotifications = notifications;
      }

      Meteor.users.update(currentUser._id, {
        $set: {
          notifications: newNotifications,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setNewCoverImages: (newImageSet) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          coverImages: newImageSet,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  updateProfileImage: (newImage) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          images: [newImage],
          previousImages: currentUser.images,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setProfileImageEmpty: () => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          images: null,
          previousImages: currentUser.images,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setGeoLocationCoords: (coords) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          geoLocationCoords: coords,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setIntroDone: () => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          isIntroDone: true,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  isUsernameTaken: (username) => {
    const user = Accounts.findUserByUsername(username);
    return Boolean(user);
  },

  isEmailRegistered: (email) => {
    const user = Accounts.findUserByEmail(email);
    return Boolean(user);
  },
});
