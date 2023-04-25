import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero, HeroBody, HeroFooter, Container, Button, Title, Subtitle } from 'bloomer';
import { Center } from '@chakra-ui/react';

function HeroSlide({
  title,
  isColor,
  subtitle,
  children,
  goNext = null,
  isSkip = false,
  ...otherProps
}) {
  const navigate = useNavigate();
  return (
    <Hero isFullHeight isBold isColor={isColor} isPaddingless={false} {...otherProps}>
      <HeroBody>
        <Container>
          {title && <Title isSize={2}>{title}</Title>}
          {subtitle && <Subtitle isSize={4}> {subtitle}</Subtitle>}

          {children}

          {goNext && (
            <div style={{ paddingTop: 24 }}>
              <Button className="is-rounded" isPulled="right" isOutlined onClick={goNext}>
                Next
              </Button>
            </div>
          )}
        </Container>
      </HeroBody>
      {isSkip && (
        <HeroFooter>
          <Center pb="8">
            <Button isPulled="center" onClick={() => navigate('/')}>
              Skip and go to the app
            </Button>
          </Center>
        </HeroFooter>
      )}
    </Hero>
  );
}

export default HeroSlide;
