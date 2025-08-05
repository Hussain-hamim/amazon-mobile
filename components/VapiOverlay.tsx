import { useOverlay } from '@/hooks/useOverlay';
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Rufus from './Rufus';

const VapiOverlay = () => {
  const { showOverlay, setShowOverlay } = useOverlay();

  return (
    <Animated.View
      exiting={FadeOut.duration(400)}
      entering={FadeIn.duration(400)}
      className='bg-slate-800  top-[110px] w-full h-full z-20 justify-center '
    >
      <Rufus />
    </Animated.View>
  );
};

export default VapiOverlay;
