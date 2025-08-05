import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PLACEHOLDER_AVATAR =
  'https://via.placeholder.com/150/cccccc/808080?text=User';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [passkeyMessage, setPasskeyMessage] = useState<string | null>(null);

  const createClerkPasskey = async () => {
    if (!user) return;
    setPasskeyMessage(null);
    try {
      await user?.createPasskey();
      setPasskeyMessage('Passkey registered successfully!');
    } catch (err: any) {
      let msg = 'Failed to register passkey.';
      if (err && err.errors && err.errors[0]?.message) {
        msg = err.errors[0].message;
      } else if (err && err.message) {
        msg = err.message;
      }
      setPasskeyMessage(msg);
    }
  };

  const userData = {
    name: user?.firstName || 'Welcome dear!',
    email: user?.primaryEmailAddress?.emailAddress || 'user@example.com',
    primeMember: true,
    orders: 12,
    wishlist: 5,
    addresses: 2,
  };

  const accountOptions = [
    { id: '1', title: 'Your Orders', icon: 'local-shipping' },
    { id: '4', title: 'Payment Options', icon: 'credit-card' },
  ];

  return (
    <ScrollView className='flex-1 bg-gray-100'>
      <StatusBar style='light' />
      <SignedIn>
        {/* User Profile Section */}
        <View className='bg-white mt-1 p-4'>
          <View className='flex-row items-center'>
            <Image
              source={{ uri: user?.imageUrl || PLACEHOLDER_AVATAR }}
              className='w-16 h-16 rounded-full'
            />
            <View className='ml-4'>
              <Text className='text-lg font-bold'>{userData.name}</Text>
              <Text className='text-gray-600'>{userData.email}</Text>
              {userData.primeMember && (
                <View className='flex-row items-center mt-1'>
                  <Image
                    source={{
                      uri: 'https://via.placeholder.com/80x30/232F3E/FFFFFF?text=Prime',
                    }}
                    className='w-16 h-6'
                    resizeMode='contain'
                  />
                  <Text className='text-xs text-gray-500 ml-1'>Member</Text>
                </View>
              )}
              {/* Passkey registration button */}
              <TouchableOpacity
                className='mt-2 bg-blue-600 px-3 max-w-40 py-2 rounded-full'
                onPress={createClerkPasskey}
                activeOpacity={0.85}
              >
                <Text className='text-white text-xs font-semibold'>
                  Register Passkey
                </Text>
              </TouchableOpacity>
              {passkeyMessage && (
                <Text
                  className={`mt-2 text-xs font-medium ${passkeyMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}
                >
                  {passkeyMessage}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Account Options */}
        <View className='mt-4 bg-white'>
          <Text className='font-bold p-4 pb-2 text-gray-800'>Your Account</Text>
          {accountOptions.map((item) => (
            <Link key={item.id} href={`/profile/${item.id}`} asChild>
              <Pressable className='flex-row items-center justify-between p-4 border-b border-gray-100'>
                <View className='flex-row items-center'>
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color='#374151'
                  />
                  <Text className='ml-4 text-gray-900 font-medium'>
                    {item.title}
                  </Text>
                </View>
                <AntDesign name='right' size={16} color='#6B7280' />
              </Pressable>
            </Link>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          className='mt-4 bg-white p-4 items-center'
          onPress={() => signOut()}
        >
          <Text className='text-red-500 font-bold'>Sign Out</Text>
        </Pressable>
      </SignedIn>

      <SignedOut>
        {/* Guest View */}
        <View className='bg-white mt-1 p-6 items-center'>
          <View
            style={{
              width: 96,
              height: 96,
              marginBottom: 24,
              // backgroundColor: '#fff',
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Ionicons name='person' color={'black'} size={40} />
          </View>

          <Text className='text-2xl font-bold text-gray-700 text-center mb-2'>
            Welcome to EaseShop
          </Text>
          <Text className='text-gray-600 text-center mb-8'>
            Sign in for the best shopping experience
          </Text>

          <Link href='/signin' asChild>
            <TouchableOpacity
              className='bg-[#FFD814] w-full py-3 rounded-md shadow-sm mb-4'
              activeOpacity={0.9}
            >
              <Text className='text-center text-gray-600 font-bold'>
                Sign in securely
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href='/signin' asChild>
            <TouchableOpacity
              className='border border-gray-300 w-full py-3 rounded-md'
              activeOpacity={0.9}
            >
              <Text className='text-center text-gray-600 font-medium'>
                Create your EaseShop account
              </Text>
            </TouchableOpacity>
          </Link>

          <View className='mt-8 w-full'>
            <Text className='text-center text-gray-500 text-xs mb-2'>
              By continuing, you agree to EaseShop
            </Text>
            <View className='flex-row justify-center'>
              <Pressable>
                <Text className='text-blue-500 text-xs'>Conditions of Use</Text>
              </Pressable>
              <Text className='text-gray-500 text-xs mx-1'>and</Text>
              <Pressable>
                <Text className='text-blue-500 text-xs'>Privacy Notice</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SignedOut>

      {/* Footer */}
      <View className='py-4 px-4 mt-1 items-center'>
        <Text className='text-gray-500 text-xs'>
          © 2025-2025, EaseShop Mobile.
        </Text>
      </View>
    </ScrollView>
  );
}
