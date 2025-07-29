import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';

export default function Todo() {
  const [task, setTask] = useState('');
  const [list, setList] = useState<
    {
      id: string;
      todo: string;
      isCompleted: boolean;
    }[]
  >([]);

  useEffect(() => {
    AsyncStorage.getItem('tasks').then((data) => {
      if (data) setList(JSON.parse(data));
    });
  }, []);

  const addTask = async () => {
    if (!task.trim()) return; // Don't add empty tasks

    const newTask = {
      id: Math.random().toString(36).substring(7),
      todo: task,
      isCompleted: false,
    };

    const updated = [...list, newTask];
    setList(updated);
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    setTask('');
  };

  const removeTask = async (id: string) => {
    const updated = list.filter((item) => item.id !== id);
    setList(updated);
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
  };

  const markCompleted = async (id: string) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setList(updated);
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
  };

  return (
    <View className='flex-1 bg-gray-50 p-4'>
      <Stack.Screen options={{ title: 'Todo List' }} />

      {/* Header */}
      <Text className='text-3xl font-bold text-indigo-900 mb-6'>My Tasks</Text>

      {/* Input Area */}
      <View className='flex-row mb-6'>
        <TextInput
          placeholder='Add a new task...'
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
          returnKeyType='done'
          className='flex-1 border border-gray-300 rounded-l-lg px-4 py-3 bg-white text-lg'
          placeholderTextColor='#9ca3af'
        />
        <TouchableOpacity
          onPress={addTask}
          className='bg-indigo-600 rounded-r-lg px-5 justify-center items-center'
          disabled={!task.trim()}
        >
          <Text className='text-white text-lg font-semibold'>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {list.length === 0 ? (
        <View className='flex-1 justify-center items-center'>
          <Ionicons name='checkmark-done-outline' size={48} color='#d1d5db' />
          <Text className='text-gray-400 text-lg mt-4'>
            No tasks yet. Add one above!
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              key={item.id}
              className='bg-white rounded-lg p-4 mb-3 shadow-sm flex-row items-center'
            >
              <TouchableOpacity onPress={() => markCompleted(item.id)}>
                <View
                  className={`w-6 h-6 rounded-full mr-3 border-2 ${item.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                >
                  {item.isCompleted && (
                    <Ionicons name='checkmark' size={16} color='white' />
                  )}
                </View>
              </TouchableOpacity>

              <Text
                className={`flex-1 text-lg ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}
              >
                {item.todo}
              </Text>

              <TouchableOpacity
                onPress={() => removeTask(item.id)}
                className='p-2'
              >
                <Ionicons name='trash-outline' size={20} color='#ef4444' />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={<View className='h-20' />}
        />
      )}
    </View>
  );
}

///////////////////////////////////

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.includes('@')) return alert('Invalid email');
    if (password.length < 6) return alert('Too short');

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
