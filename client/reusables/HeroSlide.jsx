import React from 'react';
import { Hero, HeroBody, Container, Title, Subtitle } from 'bloomer';

const HeroSlide = ({ title, isColor, subtitle, children, ...otherProps }) => (
  <Hero
    isFullHeight
    isBold
    isColor={isColor}
    isPaddingless={false}
    {...otherProps}
  >
    <HeroBody>
      <Container>
        {title && <Title isSize={2}>{title}</Title>}
        {subtitle && <Subtitle isSize={4}> {subtitle}</Subtitle>}
        {children}
      </Container>
    </HeroBody>
  </Hero>
);

export default HeroSlide;
