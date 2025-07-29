import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
    </View>
  );
}
