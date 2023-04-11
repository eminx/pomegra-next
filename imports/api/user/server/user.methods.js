import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

import { RequestsCollection } from "../../collections";

Meteor.methods({
  registerUser: (user) => {
    Accounts.createUser({
      email: user.email,
      username: user.username,
      password: user.password,
    });
  },

  updateProfile: (values, languages) => {
    const currentUser = Meteor.user();

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
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
      throw new Meteor.Error("Not allowed!");
    }
    try {
      if (contextName !== "request") {
        return;
      }
      const theRequest = RequestsCollection.findOne(contextId);
      const theOthersId =
        theRequest.requesterId === currentUser._id
          ? theRequest.ownerId
          : theRequest.requesterId;
      const theOther = Meteor.users.findOne(theOthersId);

      const contextIdIndex =
        theOther.notifications &&
        theOther.notifications.findIndex(
          (notification) => notification.contextId === contextId
        );

      if (contextIdIndex !== -1) {
        const notifications = [...theOther.notifications];
        notifications[contextIdIndex].count += 1;
        if (!notifications[contextIdIndex].unSeenIndexes) {
          return;
        }
        notifications[contextIdIndex].unSeenIndexes.push(unSeenIndex);
        Meteor.users.update(theOther._id, {
          $set: {
            notifications: notifications,
          },
        });
      } else {
        Meteor.users.update(theOther._id, {
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
      console.log("error", error);
      throw new Meteor.Error(error);
    }
  },

  removeNotification: (contextName, contextId, messageIndex) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error("Not allowed!");
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

      let onlyOneCount = false;
      if (notifications[notificationIndex].count === 1) {
        onlyOneCount = true;
      }

      if (onlyOneCount) {
        notifications.filter(
          (notification) => notification.contextId !== contextId
        );
      } else {
        notifications[notificationIndex].count -= 1;
        notifications[notificationIndex].unSeenIndexes.filter(
          (unSeenIndex) => unSeenIndex !== messageIndex
        );
      }

      Meteor.users.update(currentUser._id, {
        $set: {
          notifications: notifications,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error(error);
    }
  },

  setNewCoverImages: (newImageSet) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error("Not allowed!");
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          coverImages: newImageSet,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error(error);
    }
  },

  setNewAvatar: (newAvatar) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error("Not allowed!");
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          avatar: newAvatar,
          previousAvatar: currentUser.avatar,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error(error);
    }
  },

  setAvatarEmpty: () => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error("Not allowed!");
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          avatar: null,
          previousAvatar: currentUser.avatar,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error(error);
    }
  },

  setGeoLocationCoords: (coords) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error("Not allowed!");
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          geoLocationCoords: coords,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error(error);
    }
  },

  setIntroDone: () => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error("Not allowed!");
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          isIntroDone: true,
        },
      });
    } catch (error) {
      console.log("error", error);
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
