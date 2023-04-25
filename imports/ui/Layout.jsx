import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { createContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider, Box, Center } from '@chakra-ui/react';

export const UserContext = createContext(null);

import messages from '../api/_utils/langs/en';

function Layout({ currentUser, userLoading, children }) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      if (currentUser) {
        setIsLoading(false);
      }
    }, 5000);
  }, []);

  return (
    <IntlProvider locale="en" messages={messages}>
      <UserContext.Provider value={{ currentUser, userLoading }}>
        <ChakraProvider>
          <Box bg="gray.200" w="100%">
            <Center>
              <Box bg="white" minHeight="100vh" maxWidth="768px" w="100%">
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
