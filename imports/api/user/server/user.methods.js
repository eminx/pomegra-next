import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import BooksCollection from '../../books/book';
import RequestsCollection from '../../requests/request';
import { getNearbyUsersOrBooks } from '../../_utils/functions';

Meteor.methods({
  getCurrentUser: () => {
    return Meteor.user();
  },

  getUserProfile: (username) => {
    try {
      const user = Meteor.users.findOne({ username });
      return {
        bio: user.bio,
        firstName: user.firstName,
        images: user.images,
        languages: user.languages,
        lastName: user.lastName,
        username: user.username,
      };
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getUsers: () => {
    const currentUser = Meteor.user();
    try {
      if (currentUser) {
        return Meteor.users
          .find({
            username: { $ne: currentUser.username },
          })
          .fetch();
      } else {
        return Meteor.users.find().fetch();
      }
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  registerUser: (user) => {
    Accounts.createUser({
      bio: '',
      email: user.email,
      firstName: '',
      images: [],
      lastName: '',
      languages: [],
      notifications: [],
      password: user.password,
      username: user.username,
    });
  },

  updateProfile: (values) => {
    const currentUserId = Meteor.userId();

    try {
      Meteor.users.update(currentUserId, {
        $set: {
          ...values,
        },
      });
      if (values.location) {
        BooksCollection.update(
          { ownerId: currentUserId },
          {
            $set: {
              ownerLocation: values.location,
            },
          },
          {
            multi: true,
          }
        );
      }
    } catch (error) {
      throw new Meteor.Error(error);
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
      throw new Meteor.Error(error);
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
        theRequest.requesterId === currentUser._id
          ? theRequest.ownerId
          : theRequest.requesterId;
      const theOther = Meteor.users.findOne(theOthersId);

      const contextIdIndex = theOther.notifications?.findIndex(
        (notification) => {
          return notification.contextId === contextId;
        }
      );

      if (contextIdIndex !== -1) {
        const notifications = theOther.notifications
          ? [...theOther.notifications]
          : [];
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

  removeAllNotifications: (contextId) => {
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

      const newNotifications = notifications.filter(
        (notification, index) => index !== notificationIndex
      );

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
        const newUnSeenIndexes = notifications[
          notificationIndex
        ]?.unSeenIndexes.filter((unSeenIndex) => unSeenIndex !== messageIndex);
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

    const currentUserId = currentUser._id;

    try {
      Meteor.users.update(currentUserId, {
        $set: {
          coverImages: newImageSet,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setProfileImage: (newImage) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    const currentUserId = currentUser._id;

    try {
      Meteor.users.update(currentUserId, {
        $set: {
          images: [newImage],
          previousImages: currentUser.images,
        },
      });
      BooksCollection.update(
        {
          ownerId: currentUserId,
        },
        {
          $set: {
            ownerImage: newImage,
          },
        },
        {
          multi: true,
        }
      );
      RequestsCollection.update(
        {
          ownerId: currentUserId,
        },
        {
          $set: {
            ownerImage: newImage,
          },
        },
        {
          multi: true,
        }
      );
      RequestsCollection.update(
        {
          requesterId: currentUserId,
        },
        {
          $set: {
            requesterImage: newImage,
          },
        },
        {
          multi: true,
        }
      );
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

    const currentUserId = currentUser._id;

    try {
      Meteor.users.update(currentUserId, {
        $set: {
          images: null,
          previousImages: currentUser.images,
        },
      });
      Books.update(
        { ownerId: currentUserId },
        {
          $set: {
            ownerImage: null,
          },
        }
      );
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

  getUsersNearBy: () => {
    const user = Meteor.user();
    if (!user || !user.location) {
      return;
    }

    const radius = 100; //km

    const allUsers = Meteor.users
      .find({ _id: { $ne: user._id } })
      .fetch()
      .map((u) => ({
        userId: u._id,
        username: u.username,
        userImage: u.images && u.images[0],
        latitude: u.location?.coords.latitude,
        longitude: u.location?.coords.longitude,
      }));

    const userLocationCoords = user.location.coords;

    return getNearbyUsersOrBooks(
      userLocationCoords.latitude,
      userLocationCoords.longitude,
      radius,
      allUsers
    );
  },

  resetUserPassword: (email) => {
    const url = Meteor.absoluteUrl();
    Accounts.urls.resetPassword = function (token) {
      return `${url}reset-password/${token}`;
    };
    Meteor.call('forgotPassword', { email }, (respond, error) => {
      console.log(respond);
      if (error) {
        console.log(error);
      }
    });
  },

  deleteAccount: () => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      BooksCollection.remove({ ownerId: currentUser._id });
      Meteor.users.remove(currentUser._id);
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },
});
