import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../../ui/Layout';
import Home from '../../ui/pages/Home';
import AddBook from '../../ui/pages/AddBook';
import MyBooks from '../../ui/pages/MyBooks';
import MyBook from '../../ui/pages/MyBook';
import Discover from '../../ui/pages/Discover';
import BookDetailTobeRequested from '../../ui/pages/BookDetailTobeRequested';
import RequestsList from '../../ui/pages/RequestsList';
import Request from '../../ui/pages/Request';
import Profile from '../../ui/pages/Profile';
import Intro from '../../ui/pages/Intro';
import ResetPasswordPage from '../../ui/pages/auth/ResetPasswordPage';
import ForgotPasswordPage from '../../ui/pages/auth/ForgotPasswordPage';

const routes = [
  {
    path: '/',
    element: <Home />,
    exact: true,
  },
  {
    path: '/add',
    element: <AddBook />,
    exact: true,
  },
  {
    path: '/my-shelf',
    element: <MyBooks />,
    exact: true,
  },
  {
    path: '/my-shelf/:id',
    element: <MyBook />,
    exact: true,
  },
  {
    path: '/book/:id',
    element: <BookDetailTobeRequested />,
    exact: true,
  },
  {
    path: '/request/:id',
    element: <Request />,
    exact: true,
  },
  {
    path: '/discover',
    element: <Discover />,
    exact: true,
  },
  {
    path: '/messages',
    element: <RequestsList />,
    exact: true,
  },
  {
    path: '/profile',
    element: <Profile />,
    exact: true,
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
];

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} element={r.element} exact={r.exact} path={r.path} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;
