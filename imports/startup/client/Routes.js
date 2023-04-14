import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from '../../ui/Layout';
import Home from '../../ui/pages/Home';
import AddBook from '../../ui/pages/AddBook';
import MyBooks from '../../ui/pages/MyBooks';
import MyBook from '../../ui/pages/MyBook';
import Discover from '../../ui/pages/Discover';
import BookDetailTobeRequested from '../../ui/pages/BookDetailTobeRequested';
import RequestsList from '../../ui/pages/RequestsList';
import RequestContainer from '../../ui/pages/RequestContainer';
import Profile from '../../ui/pages/Profile';
import Intro from '../../ui/pages/Intro';
import ResetPasswordPage from '../../ui/pages/auth/ResetPasswordPage';
import ForgotPasswordPage from '../../ui/pages/auth/ForgotPasswordPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/add',
    element: <AddBook />,
  },
  {
    path: '/my-shelf',
    element: <MyBooks />,
  },
  {
    path: '/my-shelf/:id',
    element: <MyBook />,
  },
  {
    path: '/book/:id',
    element: <BookDetailTobeRequested />,
  },
  {
    path: '/request/:id',
    element: <RequestContainer />,
  },
  {
    path: '/lend',
    element: <Discover />,
  },
  {
    path: '/requests',
    element: <RequestsList />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/intro',
    element: <Intro />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
  },
]);

function Routes() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}

export default Routes;
