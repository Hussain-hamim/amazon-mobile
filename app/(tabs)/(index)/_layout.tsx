import { StyledStack } from '@/components/navigation/stack';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <StyledStack
      headerClassName='bg-dark text-white'
      contentClassName='bg-gray-100 dark:bg-dark'
    >
      <Stack.Screen name='index' options={{ title: '' }} />
    </StyledStack>
  );
};

export default Layout;
