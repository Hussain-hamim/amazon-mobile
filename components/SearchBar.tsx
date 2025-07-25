import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';
import Animated from 'react-native-reanimated';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
interface SearchBarProps {
  withBackButton?: boolean;
}
const SearchBar = ({ withBackButton = false }: SearchBarProps) => {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useMMKVBoolean('vapi.overlay');

  const onBackPress = () => {
    if (showOverlay) {
      setShowOverlay(false);
    } else {
      router.back();
    }
  };

  return (
    <Animated.View
      className='bg-[#232f3e] pt-safe z-30 px-3 py-2 absolute top-0 left-0 right-0'
      // style={[searchBarStyle, { height: searchBarHeight.value }]}
    >
      <View className='flex-1 flex-row items-center bg-white rounded-md h-12'>
        <View className='px-2 flex-row flex-1 items-center'>
          <Ionicons name='search' size={18} color='#666' className='ml-1' />
          <TextInput
            placeholder='Search Amazon'
            className='flex-1 ml-2 text-base'
            placeholderTextColor='#666'
          />
        </View>
        <TouchableOpacity className='px-3 border-gray-300 h-full justify-center'>
          <MaterialIcons name='photo-camera' size={20} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity
          className='ml-3 mr-3'
          onPress={() => setShowOverlay(!showOverlay)}
        >
          <MaterialIcons name='mic' size={24} color='black' />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default SearchBar;
