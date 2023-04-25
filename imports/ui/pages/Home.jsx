import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Divider, NavBar } from 'antd-mobile';
import { Title, Subtitle, Button } from 'bloomer';
import { Box, Flex } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';

import { UserContext } from '../Layout';
import { errorDialog, successDialog } from '../../api/_utils/functions';
import AppTabBar from '../components/AppTabBar';
import HeroSlide from '../components/HeroSlide';
import NiceShelf from '../components/NiceShelf';

function Home() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentUser) {
  //     setIsLoading(false);
  //     return;
  //   }
  //   setTimeout(() => {
  //     if (currentUser) {
  //       setIsLoading(false);
  //     } else if (isLoading) {
  //       navigate('/intro');
  //     }
  //   }, 3000);
  // }, [currentUser]);

  // if (isLoading) {
  //   return (
  //     <HeroSlide>
  //       <Flex justify="center" style={{ height: '100vh' }}>
  //         <Flex align="center" direction="column">
  //           <NiceShelf width={192} height={192} color="#3e3e3e" />
  //           <img
  //             src="https://pomegra-profile-images.s3.eu-central-1.amazonaws.com/LibrellaLogo.png"
  //             alt="Librella"
  //             width={210}
  //             height={45}
  //           />
  //         </Flex>
  //       </Flex>
  //     </HeroSlide>
  //   );
  // }

  return (
    <div>
      <NavBar backArrow={false}>Welcome to Librella</NavBar>

      <HomeWidget
        title="homeWidget1Title"
        message="homeWidget1Message"
        buttonText="homeWidget1ButtonText"
        redirectPath="/discover"
      />

      <HomeWidget
        title="homeWidget2Title"
        message="homeWidget2Message"
        buttonText="homeWidget2ButtonText"
        redirectPath="/add"
      />

      <HomeWidget
        title="homeWidget3Title"
        message="homeWidget3Message"
        buttonText="homeWidget3ButtonText"
        redirectPath="/messages"
      />

      {/* <WhiteSpace size="lg" />
        <WhiteSpace size="lg" /> */}

      <AppTabBar />
    </div>
  );
}

function HomeWidget({ title, message, redirectPath, buttonText }) {
  return (
    <Flex flexDirection="column" align="center" my="8">
      <Title isSize={4}>
        <FormattedMessage id={title} />
      </Title>
      <Box px="4" pb="4">
        <Subtitle isSize={6} hasTextAlign="centered">
          <FormattedMessage id={message} />
        </Subtitle>
      </Box>
      <Link to={redirectPath}>
        <Button
          isColor="light"
          isInverted
          isLink
          className="is-rounded"
          // onClick={() => redirect(redirectPath)}
        >
          <FormattedMessage id={buttonText} />
        </Button>
      </Link>

      <Divider />
    </Flex>
  );
}

export default Home;
