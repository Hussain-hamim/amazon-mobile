import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Button, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const createClerkPasskey = async () => {
    if (!user) return;

    try {
      await user?.createPasskey();
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      <SignedIn>
        <View className='pt-10 px-8 items-center'>
          <View className='pt-10 px-8 gap-5 items-center w-full'>
            <Text className='text-3xl text-center font-bold mb-2'>
              Welcome!
            </Text>
            <Text className='text-lg text-center mb-4'>You are signed in.</Text>
            <Button
              title='Create Passkey'
              onPress={createClerkPasskey}
              accessibilityLabel='Create a new passkey'
            />
            <View style={{ height: 12 }} />
            <Button
              title='Sign Out'
              onPress={() => signOut()}
              color='#d9534f'
              accessibilityLabel='Sign out of your account'
            />
          </View>
        </View>
      </SignedIn>
      <SignedOut>
        <View className='pt-10 px-8 items-center'>
          <Text className='text-3xl text-center font-bold mb-4'>
            Sign In / Create Account
          </Text>
          <Link href='/signin' asChild>
            <TouchableOpacity
              className='bg-primary py-3 px-8 rounded-lg border border-dark shadow-md w-full'
              activeOpacity={0.85}
              accessibilityRole='button'
              accessibilityLabel='Sign in or create an account'
            >
              <Text className='text-center text-base font-semibold text-dark'>
                Sign In / Create Account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
