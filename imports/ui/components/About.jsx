import React from 'react';
import { AutoCenter, Tag } from 'antd-mobile';
import { Avatar, Box, Center, Image, Stack, Text } from '@chakra-ui/react';
import { Subtitle } from 'bloomer';

const imageProps = {
  borderRadius: '8px',
  boxShadow: '0 0 24px 12px rgb(255 241 252)',
  border: '1px solid #fff',
};

function About({ user, isSmall = false }) {
  if (!user) {
    return null;
  }
  return (
    <Box>
      <Center p="2">
        {user.images && user.images.length > 0 ? (
          <Image height={isSmall ? '120px' : '240px'} src={user.images[0]} {...imageProps} />
        ) : (
          <Avatar size="2xl" name={user.username} {...imageProps} />
        )}
      </Center>

      <AutoCenter>
        {user.firstName && user.lastName && (
          <Box p="2">
            <Subtitle isSize={5} style={{ textAlign: 'center', marginBottom: 0 }}>
              {user.firstName + ' ' + user.lastName}
            </Subtitle>
          </Box>
        )}
        {user.bio && (
          <Box px="4" py="2">
            <Text fontSize="md" textAlign="center">
              {user.bio}
            </Text>
          </Box>
        )}
      </AutoCenter>

      <Box py="2">
        {/* <Subtitle isSize={6} style={{ color: '#656565', marginBottom: 4, textAlign: 'center' }}>
          reads in:
        </Subtitle> */}
        <Stack direction="row" justify="center" wrap="wrap">
          {user.languages &&
            user.languages.length > 0 &&
            user.languages.map((language) => (
              <Tag
                key={language?.value}
                color="primary"
                fill="outline"
                style={{ fontSize: '12px' }}
              >
                {language?.label?.toUpperCase()}{' '}
              </Tag>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default About;
