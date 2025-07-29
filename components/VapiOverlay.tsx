import { useOverlay } from '@/hooks/useOverlay';
import React from 'react';
import { Button, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const VapiOverlay = () => {
  const { showOverlay, setShowOverlay } = useOverlay();

  return (
    <Animated.View
      exiting={FadeOut.duration(400)}
      entering={FadeIn.duration(400)}
      className='bg-slate-800 mt-[-30px] top-40 w-full h-full z-20 justify-center '
    >
      <Text>VapiOverlay</Text>
      <Button title='close' onPress={() => setShowOverlay(false)} />
    </Animated.View>
  );
};

export default VapiOverlay;
