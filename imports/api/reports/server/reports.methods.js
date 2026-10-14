import { Meteor } from 'meteor/meteor';

import ReportsCollection from '../report';

Meteor.methods({
  async reportContent({ contentId, context }) {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }

    const usernameReported = currentUser.username;

    try {
      await ReportsCollection.insertAsync({
        contentId,
        context,
        usernameReported,
        status: 'pending',
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
