import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider, Box } from '@chakra-ui/react';

export const UserContext = React.createContext(null);

import messages from '../api/_utils/langs/en';

function Layout({ currentUser, userLoading, children }) {
  return (
    <IntlProvider locale="en" messages={messages}>
      <UserContext.Provider value={{ currentUser, userLoading }}>
        <ChakraProvider>
          <Box bg="gray.200" minHeight="100vh">
            {children}
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