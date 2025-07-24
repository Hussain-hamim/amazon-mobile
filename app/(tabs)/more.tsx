import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function Feed() {
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

////////////////////

function Cart() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert('Logged In!', `welcome ${email}`);
  };

  const isValid = email.length >= 6;

  return (
    <View>
      <Text className='text-2xl dark:text-white font-bold'>form</Text>
      <TextInput placeholder='email' onChangeText={setEmail} value={email} />
      <TextInput
        placeholder='password'
        onChangeText={setPassword}
        value={password}
      />

      <Button title='Login' onPress={handleLogin} disabled={isValid} />
    </View>
  );
}

//////////////////

// import * as ImagePicker from 'expo-image-picker';
// import { Button, Image } from 'react-native';
// import { useState } from 'react';

//  function ImagePickerScreen() {
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!res.canceled) {
//       setImage(res.assets[0].uri);
//     }
//   };

//   return (
//     <>
//       <Button title="Pick Image" onPress={pickImage} />
//       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//     </>
//   );
// }
