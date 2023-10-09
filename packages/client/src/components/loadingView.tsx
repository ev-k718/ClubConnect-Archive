import { Container, Flex, Loader } from '@mantine/core';
import React from 'react';

const LoadingView = () => {
  return (
    <>
      <Container size="xs" px="xs">
        <Flex direction="row" w="100%" justify={'center'} pt="5rem">
          Page Loading
        </Flex>
        <Flex direction="row" w="100%" justify={'center'} pt="1rem">
          <Loader size="lg" />
        </Flex>
      </Container>
    </>
  );
};

export default LoadingView;
