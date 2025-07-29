import SearchBar from '@/components/SearchBar';
import VapiOverlay from '@/components/VapiOverlay';
import { useOverlay } from '@/hooks/useOverlay';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const { showOverlay, setShowOverlay } = useOverlay();
  const headerHeight = useHeaderHeight();

  return (
    <View className='flex-1'>
      {showOverlay && (
        <View className='pt-12'>
          <VapiOverlay />
        </View>
      )}
      <Stack.Screen
        options={{
          header: () => <SearchBar withBackButton />,
        }}
      />
      <View style={{ paddingTop: headerHeight || 112 }}>
        <Text className='text-white '>DetailsPage {id}</Text>
      </View>
    </View>
  );
};

export default DetailsPage;
