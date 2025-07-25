import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  {
    id: '6',
    title: 'Sports Gear',
    subtitle: 'Get fit',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    color: '#6A0572',
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef<FlatList>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();

  // Animation values
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(110); // Total height of both headers
  const searchBarHeight = useSharedValue(60); // Search bar height
  const menuHeight = useSharedValue(50); // Menu bar height

  const fetchProducts = async () => {
    try {
      const url = 'https://e206fbebdde0.ngrok-free.app/articles';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Auto-scroll banner every 4 seconds
    const startAutoScroll = () => {
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleBannerScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setActiveBanner(index);

    // Reset auto-scroll timer when user manually scrolls
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Menu bar animation (disappears first)
  const menuStyle = useAnimatedStyle(() => {
    const translateY = Math.min(scrollY.value, menuHeight.value);
    return {
      transform: [{ translateY: -translateY }],
      opacity: withTiming(scrollY.value > 10 ? 0 : 1, { duration: 200 }),
    };
  });

  // Search bar animation (disappears second)
  const searchBarStyle = useAnimatedStyle(() => {
    const translateY = Math.max(
      0,
      Math.min(scrollY.value - menuHeight.value, searchBarHeight.value)
    );
    return {
      transform: [{ translateY: -translateY }],
      opacity: withTiming(scrollY.value > menuHeight.value + 10 ? 0 : 1, {
        duration: 200,
      }),
    };
  });

  // Content padding animation
  const contentOffsetStyle = useAnimatedStyle(() => {
    return {
      paddingTop: withTiming(
        scrollY.value > headerHeight.value
          ? 0
          : headerHeight.value - scrollY.value,
        { duration: 200 }
      ),
    };
  });

  const getItemLayout = (data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredIndex: number;
    averageItemLength: number;
  }) => {
    bannerScrollRef.current?.scrollToOffset({
      offset: info.averageItemLength * info.index,
      animated: true,
    });
    setTimeout(() => {
      if (bannerScrollRef.current) {
        bannerScrollRef.current.scrollToIndex({
          index: info.index,
          animated: true,
        });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center bg-gray-50'>
        <ActivityIndicator size='large' color='#3B82F6' />
        <Text className='mt-4 text-lg text-gray-600'>Loading products...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className='flex-1 bg-gray-50'>
      <StatusBar style='light' />

      {/* SEARCH BAR - VISUALLY ON TOP */}
      <Animated.View
        className='bg-[#131921] z-30 px-3 py-2 absolute top-0 left-0 right-0'
        style={[searchBarStyle, { height: searchBarHeight.value }]}
      >
        <View className='flex-1 flex-row items-center bg-white rounded-md h-12'>
          <View className='px-2 flex-row flex-1 items-center'>
            <Ionicons name='search' size={18} color='#666' className='ml-1' />
            <TextInput
              placeholder='Search Amazon'
              className='flex-1 ml-2 text-base'
              placeholderTextColor='#666'
            />
          </View>
          <TouchableOpacity className='px-3 border-gray-300 h-full justify-center'>
            <MaterialIcons name='photo-camera' size={20} color='#666' />
          </TouchableOpacity>
          <TouchableOpacity className='ml-3 mr-3'>
            <MaterialIcons name='mic' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* MENU BAR - BELOW SEARCH */}
      <Animated.View
        className='w-full bg-[#232f3e] z-20 absolute left-0 right-0'
        style={[
          menuStyle,
          {
            top: searchBarHeight.value, // Position below search bar
            height: menuHeight.value,
          },
        ]}
      >
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
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
            <Text className='text-white text-lg font-bold ml-1'>48163</Text>
          </View>
          {['Alexa Lists', 'Prime', 'Video', 'Books', 'PC', 'Musik'].map(
            (item) => (
              <TouchableOpacity key={item}>
                <Text className='text-white text-md font-semibold'>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </Animated.ScrollView>
      </Animated.View>

      {/* MAIN CONTENT */}
      <AnimatedFlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight.value }}
        ListHeaderComponent={
          <>
            {/* Hero Banners */}
            <View className='h-64 mt-2'>
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
                    <View className='absolute bottom-0 left-0 right-0 p-6 bg-black/30'>
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
                onScrollToIndexFailed={handleScrollToIndexFailed}
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
                      <Feather name={item.icon} size={24} color='#3B82F6' />
                    </View>
                    <Text className='mt-2 text-sm text-gray-700'>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Deals */}
            <View className='px-4 py-2'>
              <Text className='text-xl font-bold text-gray-900 mb-4'>
                Hot Deals
              </Text>
              <View className='flex-row flex-wrap justify-between'>
                {deals.map((deal) => (
                  <TouchableOpacity
                    key={deal.id}
                    className='w-[48%] bg-white rounded-lg p-4 mb-4 shadow-sm'
                  >
                    <View className='flex-row items-center'>
                      <View className='bg-blue-100 p-2 rounded-full'>
                        <Feather name={deal.icon} size={20} color='#3B82F6' />
                      </View>
                      <Text className='ml-3 font-medium text-gray-800'>
                        {deal.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
        renderItem={({ item }) => (
          <Link href={`/(tabs)/${item.id}`} asChild>
            <TouchableOpacity className='mx-4 my-2 bg-white rounded-xl p-4 shadow-sm'>
              <View className='flex-row'>
                <Image
                  source={{
                    // uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
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
                      {/* {Math.random() > 0.5 && ( */}
                    </View>
                    <TouchableOpacity className='bg-blue-600 p-2 rounded-full'>
                      <Feather name='shopping-cart' size={18} color='white' />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        ListFooterComponent={<View className='h-20' />}
      />
    </SafeAreaView>
  );
}
