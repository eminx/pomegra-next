import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { WebApp } from 'meteor/webapp';
import querystring from 'node:querystring';

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
});

WebApp.rawConnectHandlers.use('/errorlog', async (req, res) => {
  let data = '';
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => console.debug(querystring.parse(data)));
  res.end(); // send ok to client
});

Accounts.onLogin((error, response) => {
  console.log('login success');
  console.log('error', error);
  console.log('response', response);
});

Accounts.onLoginFailure((error, response) => {
  console.log('login failure');
  console.log('error', error);
  console.log('response', response);
});
