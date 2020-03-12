import React from 'react';
import { App, View } from 'framework7-react';
import CreateAccountContainer from './CreateAccountContainer';
// import BooksContainer from './BooksContainer';
import AddBookContainer from './AddBookContainer';
import BookDetailTobeAdded from './BookDetailTobeAdded';
import BookDetailTobeRequested from './BookDetailTobeRequested';
import MyBookContainer from './MyBookContainer';
import MyBooksContainer from './MyBooksContainer';
import FindContainer from './FindContainer';
import RequestsList from './RequestsList';
import RequestContainer from './RequestContainer';

import 'antd-mobile/dist/antd-mobile.less';

const routes = [
  {
    name: 'create-account',
    path: '/',
    component: CreateAccountContainer
  },
  {
    name: 'find',
    path: '/find/',
    component: FindContainer
  },
  {
    name: 'add',
    path: '/add/',
    component: AddBookContainer
  },
  // {
  //   name: 'books',
  //   path: '/books/',
  //   component: BooksContainer,
  // },
  {
    name: 'my-books',
    path: '/my-books/',
    component: MyBooksContainer
  },
  {
    name: 'book-detail-tobe-added',
    path: '/book-detail-tobe-added/',
    component: BookDetailTobeAdded
  },
  {
    name: 'book-detail-tobe-requested',
    path: '/book-detail-tobe-requested/',
    component: BookDetailTobeRequested
  },
  {
    name: 'book-detail',
    path: '/book-detail/',
    component: MyBookContainer
  },
  {
    name: 'requests-list',
    path: '/requests/',
    component: RequestsList
  },
  {
    name: 'request',
    path: '/request/',
    component: RequestContainer
  }
];

const f7params = {
  routes,
  name: 'Librella',
  id: 'com.librella.alpha',
  theme: 'ios'
};

export default () => (
  <App params={f7params}>
    <View main url="/" />
  </App>
);
