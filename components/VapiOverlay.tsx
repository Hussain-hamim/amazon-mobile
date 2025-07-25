import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const VapiOverlay = () => {
  return (
    <Animated.View
      exiting={FadeOut.duration(400)}
      entering={FadeIn.duration(400)}
      className='bg-white top-0 w-full h-full z-20 justify-center '
    >
      <Text>VapiOverlay</Text>
    </Animated.View>
  );
};

export default VapiOverlay;
