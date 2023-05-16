import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../../ui/Layout';
import Home from '../../ui/pages/Home';
import AddBook from '../../ui/pages/AddBook';
import Book from '../../ui/pages/Book';
import Discover from '../../ui/pages/Discover';
import RequestsList from '../../ui/pages/RequestsList';
import Request from '../../ui/pages/Request';
import Intro from '../../ui/pages/Intro';
import ResetPasswordPage from '../../ui/pages/auth/ResetPasswordPage';
import ForgotPasswordPage from '../../ui/pages/auth/ForgotPasswordPage';
import PublicProfile from '../../ui/pages/PublicProfile';

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
    path: '/book/:id',
    element: <Book />,
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
  {
    path: '/:username',
    element: <PublicProfile />,
    // exact: true,
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
