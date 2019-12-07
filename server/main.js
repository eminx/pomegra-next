import { Meteor } from 'meteor/meteor';
import { Books } from '/imports/api/collections';

function insertLink(title, url) {
  Books.insert({ title, url, createdAt: new Date() });
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (Books.find().count() === 0) {
    insertLink(
      'Do the Tutorial',
      'https://www.meteor.com/tutorials/react/creating-an-app'
    );

    insertLink('Follow the Guide', 'http://guide.meteor.com');

    insertLink('Read the Docs', 'https://docs.meteor.com');

    insertLink('Discussions', 'https://forums.meteor.com');
  }
});
