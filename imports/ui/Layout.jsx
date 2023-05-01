import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ChakraProvider, Box, Center, Flex } from '@chakra-ui/react';

export const UserContext = createContext(null);

import NiceShelf from './components/NiceShelf';
import messages from '../api/_utils/langs/en';

function Layout({ currentUser, userLoading, children }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  useEffect(() => {
    setTimeout(() => {
      if (!Meteor.user()) {
        setLoading(false);
        return navigate('/intro');
      }
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading) {
    return (
      <Center>
        <Flex align="center" direction="column">
          <NiceShelf width={192} height={192} color="#3e3e3e" />
          <img
            src="https://pomegra-profile-images.s3.eu-central-1.amazonaws.com/LibrellaLogo.png"
            alt="Librella"
            width={210}
            height={45}
          />
        </Flex>
      </Center>
    );
  }

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
