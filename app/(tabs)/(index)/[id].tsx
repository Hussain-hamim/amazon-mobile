import Rufus from '@/components/Rufus';
import SearchBar from '@/components/SearchBar';
import VapiOverlay from '@/components/VapiOverlay';
import { useOverlay } from '@/hooks/useOverlay';
import { createOrder, createPaymentIntent, getArticleById } from '@/utils/api';
import { useCartStore } from '@/utils/cartStore';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useAuth, useUser } from '@clerk/clerk-expo';
import { useStripe } from '@stripe/stripe-react-native';

const MOCK_RATING = 4.5;
const MOCK_REVIEWS = 1193;
const MOCK_BRAND = 'Expo';
const MOCK_PRIME = true;

const SUGGESTED_PHRASES = [
  'What do customers say?',
  'What colours does it come in?',
  'What is the size?',
  'What is the weight?',
  'What is the material?',
  'What is the care instructions?',
  'What is the warranty?',
  'What is the return policy?',
  'What is the shipping policy?',
];

const AnimatedBottomSheetScrollView = Animated.createAnimatedComponent(
  BottomSheetScrollView
);
const AnimatedBottomSheetView =
  Animated.createAnimatedComponent(BottomSheetView);

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const { showOverlay } = useOverlay();
  const { addArticle } = useCartStore();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['9%', '25%', '50%'], []);
  const currentPosition = useSharedValue(0);
  const showRufus = useSharedValue(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(+id),
  });

  useEffect(() => {
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0, {
        velocity: 0,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
      });
    }, 1300);
  }, []);

  useAnimatedReaction(
    () => currentPosition,
    (position) => {
      showRufus.value = position.value > 0 && position.value < 650;
    }
  );

  const rufusStyles = useAnimatedStyle(() => {
    return {
      display: showRufus.value ? 'flex' : 'none',
    };
  });

  const pharasesStyles = useAnimatedStyle(() => {
    return {
      display: showRufus.value ? 'none' : 'flex',
    };
  });

  const onPhrasePress = (phrase: string) => {
    //
  };

  const onAddToCart = () => {
    addArticle(data!);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  ///////////////////////
  /// buy now code

  // Add these new hooks for payment
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const router = useRouter();

  // Add these mutation hooks
  const { isPending: isOrderPending, mutate: orderMutation } = useMutation({
    mutationFn: async ({
      article,
      token,
    }: {
      article: Article;
      token: string;
    }) => {
      // Convert single article to array with quantity 1 for order creation
      const articles = [{ ...article, quantity: 1 }];
      return createOrder(articles, token);
    },
    onSuccess: () => {
      paymentMutation();
    },
    onError: (error) => {
      console.log('Error creating order', error);
      setBuyNowLoading(false);
    },
  });

  const { isPending: isPaymentPending, mutate: paymentMutation } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return createPaymentIntent(
        data!.price,
        user?.emailAddresses[0].emailAddress ?? '',
        token!
      );
    },
    onSuccess: (data) => {
      const { paymentIntent, ephemeralKey, customer } = data;
      showPaymentSheet(paymentIntent, ephemeralKey, customer);
    },
    onError: (error) => {
      console.log('Error creating payment intent', error);
      setBuyNowLoading(false);
    },
  });

  const showPaymentSheet = async (
    paymentIntent: string,
    ephemeralKey: string,
    customer: string
  ) => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'hussainhussain.me',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: user?.fullName ?? '',
      },
    });

    if (error) {
      console.log('Error initializing payment sheet', error);
      setBuyNowLoading(false);
    } else {
      const { error } = await presentPaymentSheet();
      if (error) {
        console.log('Error presenting payment sheet (or canceled)', error);
        setBuyNowLoading(false);
      } else {
        Alert.alert('Success', 'Your order is confirmed!', [
          {
            text: 'OK',
            onPress: () => {
              router.dismissAll();
            },
          },
        ]);
      }
    }
  };

  const handleBuyNow = async () => {
    if (!data) return;

    const token = await getToken();
    setBuyNowLoading(true);

    if (!token) {
      Alert.alert('Error', 'Please login to continue');
      setBuyNowLoading(false);
      return;
    }

    orderMutation({ article: data, token });
  };

  ///////////////////////////

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Stack.Screen
          options={{
            header: () => <SearchBar withBackButton />,
          }}
        />
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View
        className='flex-1 items-center justify-center'
        style={{ paddingTop: 120 }}
      >
        <Text>Failed to load product.</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white' style={{ paddingTop: 110 }}>
      {showOverlay && (
        <View className=''>
          <VapiOverlay />
        </View>
      )}
      <Stack.Screen
        options={{
          header: () => <SearchBar withBackButton />,
        }}
      />
      <ScrollView contentContainerClassName='pb-20'>
        <View className='items-center bg-[#f7f7f7] p-4'>
          <Image
            source={{ uri: data?.imageUrl }}
            className='w-[220px] h-[220px] rounded-xl'
            resizeMode='cover'
          />
        </View>
        <Text className='text-[#555] font-semibold text-base mt-2 ml-4'>
          {MOCK_BRAND}
        </Text>
        <Text className='text-[22px] font-bold mx-4 mt-1'>{data?.title}</Text>

        {/* Rating & Reviews */}
        <View className='flex-row items-center ml-4 mt-1.5 gap-2'>
          <Text className='font-bold'>
            {MOCK_RATING}{' '}
            <Ionicons name='star' size={16} className='text-primary' />
          </Text>
          <Text className='text-[#888] text-[15px]'>({MOCK_REVIEWS})</Text>
          {MOCK_PRIME && (
            <View className='bg-[#00A8E1] rounded px-1.5 py-0.5 ml-2'>
              <Text className='text-white font-bold text-xs'>Prime</Text>
            </View>
          )}
        </View>

        {/* Price */}
        <Text className='text-[24px] font-bold text-[#B12704] ml-4 mt-2.5'>
          ${data?.price?.toFixed(2) ?? 'N/A'}
        </Text>

        {/* Description */}
        <Text className='font-bold text-lg ml-4 mt-4.5 mb-1'>
          Product Description
        </Text>
        <Text className='text-[15px] text-[#333] mx-4 mb-4'>
          {data?.description}
        </Text>
        {/* View in 3D */}
        <Link href={`/(modal)/(3d)/${id}`} asChild>
          <TouchableOpacity className='flex-1 mx-10 rounded-full items-center justify-center py-4 border border-blue-500 '>
            <Text className='text-blue-500 font-bold text-base'>
              View in 3D
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Bottom Buttons */}
        <TouchableOpacity
          onPress={onAddToCart}
          className='flex-1 mx-10 bg-[#FFD814] rounded-full items-center justify-center py-4 my-4'
        >
          <Text className='text-[#222] font-bold text-base'>Add to Basket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBuyNow}
          className='flex-1 mx-10 bg-[#FFA41C] rounded-full items-center justify-center py-4'
          disabled={buyNowLoading || isOrderPending || isPaymentPending}
        >
          {buyNowLoading || isOrderPending || isPaymentPending ? (
            <ActivityIndicator color='#222' />
          ) : (
            <Text className='text-[#222] font-bold text-base'>Buy Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        animatedPosition={currentPosition}
        animateOnMount={false}
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginLeft: 4,
        }}
      >
        <AnimatedBottomSheetView
          style={[rufusStyles, { maxWidth: Dimensions.get('window').width }]}
        >
          <View className='flex-row items-center px-4 border-b border-gray-200 pb-2'>
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.snapToIndex(0)}
            >
              <Ionicons name='close' size={24} className='text-gray-500' />
            </TouchableOpacity>
            <Text className='text-2xl font-bold   text-center flex-1'>
              Rufus AI
            </Text>
          </View>
          <Rufus />
        </AnimatedBottomSheetView>

        <AnimatedBottomSheetScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={pharasesStyles}
        >
          {SUGGESTED_PHRASES.map((phrase, idx) => (
            <TouchableOpacity
              key={idx}
              className='bg-blue-100  px-3 mx-1 py-2 rounded-full mb-2 h-10'
              activeOpacity={0.7}
              onPress={() => onPhrasePress(phrase)}
            >
              <Text className='text-blue-700 font-medium text-sm'>
                {phrase}
              </Text>
            </TouchableOpacity>
          ))}
        </AnimatedBottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default DetailsPage;
