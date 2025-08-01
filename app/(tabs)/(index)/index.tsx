import VapiOverlay from '@/components/VapiOverlay';
import { useOverlay } from '@/hooks/useOverlay';
import { getArticles } from '@/utils/api';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef<FlatList>(null);
  const scrollInterval = useRef<NodeJS.Timeout>(null);

  const { showOverlay } = useOverlay();

  // Animation values
  const scrollY = useSharedValue(0);
  const menuHeight = useSharedValue(50); // Menu bar height

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
  });

  const onRefresh = () => {
    setRefreshing(true);
  };

  // Banner style and animation
  useEffect(() => {
    // Auto-scroll banner every 4 seconds
    const startAutoScroll = () => {
      //@ts-ignore
      scrollInterval.current = setInterval(() => {
        setActiveBanner((prev) => {
          const nextIndex = (prev + 1) % heroBanners.length;
          bannerScrollRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 4000);
    };

    startAutoScroll();

    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, []);

  const handleBannerScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    // console.log(contentOffset); // first=411 second=822 ...
    // console.log(SCREEN_WIDTH); // 411
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setActiveBanner(index);

    // Reset auto-scroll timer when user manually scrolls
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    //@ts-ignore
    scrollInterval.current = setInterval(() => {
      setActiveBanner((prev) => {
        const nextIndex = (prev + 1) % heroBanners.length;
        bannerScrollRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);
  };

  const getItemLayout = (data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  // Top menu style and animation
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const menuStyle = useAnimatedStyle(() => {
    const translateY = Math.min(scrollY.value, menuHeight.value);
    return {
      transform: [{ translateY: -translateY }],
      opacity: withTiming(scrollY.value > 10 ? 0 : 1, { duration: 400 }),
    };
  });

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          Error loading articles:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <StatusBar style='light' />

      {showOverlay && <VapiOverlay />}

      {/* Top Menu */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='w-full top-[111px] bg-[#232f3e]  absolute left-0 right-0'
        style={menuStyle}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 24,
        }}
      >
        <View className='flex-row items-center'>
          <Ionicons name='location-outline' size={20} color='white' />
          <Text className='text-white text-lg font-bold ml-1'>h1s2n3</Text>
        </View>
        {['Alexa Lists', 'Prime', 'Video', 'Books', 'Musik'].map((item) => (
          <TouchableOpacity key={item}>
            <Text className='text-white text-md font-semibold'>{item}</Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      {/* MAIN CONTENT */}
      <Animated.FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 155 }}
        ListHeaderComponent={
          <>
            {/* Hero Banners */}
            <View className='h-64'>
              <FlatList
                ref={bannerScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={heroBanners}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ width: SCREEN_WIDTH }}>
                    <Image
                      source={{ uri: item.image }}
                      className='w-full h-full'
                      resizeMode='cover'
                    />
                    <View className='absolute bottom-0 left-0 right-0 p-4 bg-black/30'>
                      <Text className='text-white text-2xl font-bold'>
                        {item.title}
                      </Text>
                      <Text className='text-white text-lg'>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                )}
                getItemLayout={getItemLayout}
                onScroll={handleBannerScroll}
                initialScrollIndex={activeBanner}
              />
              <View className='absolute bottom-4 left-0 right-0 flex-row justify-center'>
                {heroBanners.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${activeBanner === index ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </View>
            </View>

            {/* Categories */}
            <View className='px-4 py-6'>
              <Text className='text-xl font-bold text-gray-900 mb-4'>
                Shop by Category
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity className='items-center mx-2'>
                    <View className='bg-blue-50 p-4 rounded-full'>
                      {/* @ts-ignore */}
                      <Feather name={item.icon} size={24} color='#3B82F6' />
                    </View>
                    <Text className='mt-2 text-sm text-gray-700'>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Products Header */}
            <View className='px-4 py-2'>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-xl font-bold text-gray-900'>
                  Featured Products
                </Text>
                <TouchableOpacity>
                  <Text className='text-blue-600'>See all</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) =>
          isLoading ? (
            <View className='flex-1 items-center justify-center gap-6 pb-6 bg-gray-50 flex-row'>
              <Text className='mt-4 text-lg text-gray-600'>
                Loading products...
              </Text>
              <ActivityIndicator size='large' color='#3B82F6' />
            </View>
          ) : (
            <Link href={`/(tabs)/${item.id}`} asChild>
              <TouchableOpacity className='mx-4 my-2 bg-white rounded-xl p-4 shadow-sm'>
                <View className='flex-row'>
                  <Image
                    source={{
                      uri: item.imageUrl,
                    }}
                    className='w-24 h-24 rounded-lg'
                    resizeMode='contain'
                  />
                  <View className='ml-4 flex-1'>
                    <Text className='font-bold text-gray-900' numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text
                      className='text-sm text-gray-500 mt-1'
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>

                    <View className='flex-row items-center mt-2'>
                      <View className='bg-yellow-100 px-2 py-1 rounded'>
                        <Text className='text-yellow-800 text-xs font-bold'>
                          4.8 ★
                        </Text>
                      </View>
                      <Text className='text-gray-500 text-xs ml-2'>
                        (1.2k reviews)
                      </Text>
                    </View>

                    <View className='mt-3 flex-row justify-between items-center'>
                      <View>
                        <Text className='font-bold text-lg text-gray-900'>
                          ${item.price}
                        </Text>
                      </View>
                      <TouchableOpacity className='bg-blue-600 p-2 rounded-full'>
                        <Feather name='shopping-cart' size={18} color='white' />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          )
        }
        ListFooterComponent={<View className='h-20 ' />}
      />
    </View>
  );
}

const heroBanners = [
  {
    id: '1',
    title: 'Summer Collection',
    subtitle: 'Up to 50% off',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
    color: '#FF6B6B',
  },
  {
    id: '2',
    title: 'Tech Gadgets',
    subtitle: 'New arrivals',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: 'Home Essentials',
    subtitle: 'Limited time offer',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    color: '#FFBE0B',
  },
  {
    id: '4',
    title: 'Fashion Trends',
    subtitle: 'Shop now',
    image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664',
    color: '#F7B7A3',
  },
  {
    id: '5',
    title: 'Beauty Products',
    subtitle: 'Best deals',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    color: '#FF6F61',
  },
];

const categories = [
  { id: '1', name: 'Electronics', icon: 'smartphone' },
  { id: '2', name: 'Fashion', icon: 'shopping-bag' },
  { id: '3', name: 'Home', icon: 'home' },
  { id: '4', name: 'Beauty', icon: 'smile' },
  { id: '5', name: 'Sports', icon: 'dribbble' },
  { id: '6', name: 'Books', icon: 'book' },
];

const deals = [
  { id: '1', name: 'Flash Sale', icon: 'zap' },
  { id: '2', name: 'Top Deals', icon: 'tag' },
  { id: '3', name: 'New Arrivals', icon: 'star' },
  { id: '4', name: 'Best Sellers', icon: 'award' },
];
