import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

export default function Cart() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const jsonData = await res.json();

    setData(jsonData);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Text className='text-lg font-semibold border-b border-gray-200 p-4'>
          {item.name} - {item.email}
        </Text>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchPosts().then(() => setRefreshing(false));
          }}
        />
      }
    />
  );
}
