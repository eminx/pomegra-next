import React from 'react';
import { App, View } from 'framework7-react';
import CreateAccountContainer from './CreateAccountContainer';
import BooksContainer from './BooksContainer';
import AddBookContainer from './AddBookContainer';

const routes = [
  {
    name: 'add',
    path: '/add/',
    component: AddBookContainer,
    options: {
      history: true,
    },
  },
  {
    name: 'books',
    path: '/books/',
    component: BooksContainer,
    options: {
      history: true,
    },
  },
  {
    name: 'create-account',
    path: '/',
    component: CreateAccountContainer,
    options: {
      history: true,
    },
  },
];

const f7params = {
  routes,
  name: 'My App',
  id: 'com.myapp.test',
  theme: 'aurora',
};

export default () => (
  <App params={f7params}>
    <View main url="/" />
  </App>
);
