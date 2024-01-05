import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import {
//   BooksCollection,
//   MessagesCollection,
//   RequestsCollection,
// } from '../../api/collections';

import './api';

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${
    smtp.password
  }@${smtp.host}:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };

  // MessagesCollection.find().forEach((m) => {
  //   const lastMessageDate =
  //     m.messages &&
  //     m.messages.length > 0 &&
  //     m.messages[m.messages.length - 1]?.createdDate;
  //   if (!lastMessageDate) {
  //     return;
  //   }
  //   RequestsCollection.update(
  //     { _id: m.requestId },
  //     {
  //       $set: {
  //         lastMessageDate: lastMessageDate,
  //       },
  //     }
  //   );
  // });
});
