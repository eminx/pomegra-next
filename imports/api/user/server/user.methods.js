import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import BooksCollection from '../../books/book';
import RequestsCollection from '../../requests/request';
import { getNearbyUsersOrBooks } from '../../_utils/functions';

Meteor.methods({
  getCurrentUser: async () => {
    return await Meteor.userAsync();
  },

  getUserProfile: async (username) => {
    try {
      const user = await Meteor.users.findOneAsync({ username });
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

  getUsers: async () => {
    const currentUser = await Meteor.userAsync();
    try {
      if (currentUser) {
        return await Meteor.users
          .find({
            username: { $ne: currentUser.username },
          })
          .fetchAsync();
      } else {
        return await Meteor.users.find().fetchAsync();
      }
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  registerUser: async (user) => {
    await Accounts.createUserAsync({
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

  updateProfile: async (values) => {
    const currentUser = await Meteor.userAsync();
    const currentUserId = currentUser._id;

    try {
      await Meteor.users.updateAsync(currentUserId, {
        $set: {
          ...values,
        },
      });
      if (values.location) {
        await BooksCollection.updateAsync(
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

  updateLanguages: async (languages) => {
    const currentUser = await Meteor.userAsync();

    try {
      await Meteor.users.updateAsync(currentUser._id, {
        $set: {
          languages: languages,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  createNotification: async (contextName, contextId, unSeenIndex) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      if (contextName !== 'request') {
        return;
      }
      const theRequest = await RequestsCollection.findOneAsync(contextId);
      const theOthersId =
        theRequest.requesterId === currentUser._id
          ? theRequest.ownerId
          : theRequest.requesterId;
      const theOther = await Meteor.users.findOneAsync(theOthersId);

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

        await Meteor.users.updateAsync(theOthersId, {
          $set: {
            notifications: notifications,
          },
        });
      } else {
        await Meteor.users.updateAsync(theOthersId, {
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

  removeAllNotifications: async (contextId) => {
    const currentUser = await Meteor.userAsync();
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

      await Meteor.users.updateAsync(currentUser._id, {
        $set: {
          notifications: newNotifications,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  removeNotification: async (contextId, messageIndex) => {
    const currentUser = await Meteor.userAsync();
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

      await Meteor.users.updateAsync(currentUser._id, {
        $set: {
          notifications: newNotifications,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setNewCoverImages: async (newImageSet) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    const currentUserId = currentUser._id;

    try {
      await Meteor.users.updateAsync(currentUserId, {
        $set: {
          coverImages: newImageSet,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setProfileImage: async (newImage) => {
    console.log(newImage);
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    const currentUserId = currentUser._id;

    try {
      await Meteor.users.updateAsync(currentUserId, {
        $set: {
          images: [newImage],
          previousImages: currentUser.images,
        },
      });
      await BooksCollection.updateAsync(
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
      await RequestsCollection.updateAsync(
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
      await RequestsCollection.updateAsync(
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

  setProfileImageEmpty: async () => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    const currentUserId = currentUser._id;

    try {
      await Meteor.users.updateAsync(currentUserId, {
        $set: {
          images: null,
          previousImages: currentUser.images,
        },
      });
      await BooksCollection.updateAsync(
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

  setGeoLocationCoords: async (coords) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await Meteor.users.updateAsync(currentUser._id, {
        $set: {
          geoLocationCoords: coords,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setIntroDone: async () => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await Meteor.users.updateAsync(currentUser._id, {
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

  getAllUsers: async () => {
    const user = await Meteor.userAsync();
    if (!user || !user.locationSearchEnabled) {
      const users = await Meteor.users.find().fetchAsync();
      return users.map((u) => ({
        userId: u._id,
        username: u.username,
        userImage: u.images && u.images[0],
      }));
    }

    const radius = user.locationSearchRadius;

    const allUsers = await Meteor.users
      .find({ _id: { $ne: user._id } })
      .fetchAsync();
    const allUsersMapped = allUsers.map((u) => ({
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
      allUsersMapped
    );
  },

  resetUserPassword: (email) => {
    const url = Meteor.absoluteUrl();
    Accounts.urls.resetPassword = function (token) {
      return `${url}reset-password/${token}`;
    };

    Accounts.forgotPassword({ email });
  },

  deleteAccount: async () => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      await BooksCollection.removeAsync({ ownerId: currentUser._id });
      await Meteor.users.removeAsync(currentUser._id);
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  blockUser: async (userId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      if (!currentUser.blockedUsers) {
        await Meteor.users.updateAsync(currentUser._id, {
          $set: {
            blockedUsers: [userId],
          },
        });
      } else {
        await Meteor.users.updateAsync(currentUser._id, {
          $addToSet: {
            blockedUsers: userId,
          },
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },
});
