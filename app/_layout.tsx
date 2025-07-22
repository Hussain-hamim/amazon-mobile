import { StyledStack } from '@/components/navigation/stack';
import '@/global.css';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { passkeys } from '@clerk/expo-passkeys';
import { Ionicons } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { LogBox, TouchableOpacity, useColorScheme } from 'react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}
LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys']);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const InitialLayout = () => {
  const router = useRouter();

  return (
    <StyledStack
      contentClassName='bg-gray-100 dark:bg-dark'
      headerClassName='bg-dark text-white'
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='signin'
        options={{ title: 'Amazon', presentation: 'fullScreenModal' }}
      />

      <Stack.Screen
        name='(modal)/rufus'
        options={{
          title: 'Rufus',
          headerTintColor: '#000',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name='close' size={24} className='text-gray-400' />
            </TouchableOpacity>
          ),
          presentation: 'formSheet',
          sheetAllowedDetents: [0.45, 0.95],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          contentStyle: {
            backgroundColor: '#fff',
          },
          // sheetLargestUndimmedDetentIndex: 'last',
        }}
      />
    </StyledStack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      __experimental_passkeys={passkeys}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkLoaded>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <InitialLayout />
          </ThemeProvider>
        </ClerkLoaded>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
