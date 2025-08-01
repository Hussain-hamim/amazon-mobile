import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [color, setColor] = useState('green');

  useEffect(() => {
    setTimeout(() => {
      setColor('blue');
    }, 3000);

    setTimeout(() => {
      setColor('red');
    }, 6000);
  }, []);

  return (
    <View style={{ backgroundColor: color }}>
      <Text style={{ color: 'white', fontSize: 20 }}>Hello, World!</Text>

      <TouchableOpacity
        className='bg-[#FFD814] w-full py-3 rounded-md shadow-sm mb-4'
        activeOpacity={0.9}
      >
        <Text className='text-center text-gray-600 font-bold'>Hello world</Text>
      </TouchableOpacity>
    </View>
  );
}
