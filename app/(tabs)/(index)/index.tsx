import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/articles`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log('Fetch error', err));
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text className='dark:text-white' onPress={() => router.push('/(tabs)')}>
        Hello world
      </Text>
      <Text className='text-green-500 text-2xl'>
        {data && JSON.stringify(data[1])}
      </Text>
    </View>
  );
}
