import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { createContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider, Box, Center } from '@chakra-ui/react';

export const UserContext = createContext(null);

import messages from '../api/_utils/langs/en';

function Layout({ currentUser, userLoading, children }) {
  return (
    <IntlProvider locale="en" messages={messages}>
      <UserContext.Provider value={{ currentUser, userLoading }}>
        <ChakraProvider>
          <Box bg="gray.200" w="100%">
            <Center>
              <Box bg="gray.100" minHeight="100vh" maxWidth="768px" mb="48px" w="100%">
                {children}
              </Box>
            </Center>
          </Box>
        </ChakraProvider>
      </UserContext.Provider>
    </IntlProvider>
  );
}

export default LayoutContainer = withTracker((props) => {
  const currentUserSub = Meteor.subscribe('me');
  const userLoading = !currentUserSub.ready();
  const currentUser = Meteor.user();

  return {
    currentUser,
    userLoading,
  };
})(Layout);
