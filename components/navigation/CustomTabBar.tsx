// import rufusIcon from "@/assets/images/rufus.png";
import rufusIcon from "@/assets/images/rufus.png";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// https://salamina.tech/blog/post/custom-tab-bar-tab-navigation-expo-react-native/
export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0); // Stores the total width of the tab bar
  const tabWidth = tabBarWidth / state.routes.length; // Width of each tab
  const translateX = useSharedValue(state.index * tabWidth); // Animated X-position for the indicator
  // if the tabbar total with is 200px for four tabs each will have 50px
  // so the translateX value will be 0,2,3,4 * tabWidth which is 50px
  // so the border value will go to each tab dynamically

  const indicatorPadding = 20; // px
  const indicatorWidth =
    tabWidth > 2 * indicatorPadding
      ? tabWidth - 2 * indicatorPadding
      : tabWidth;

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth + indicatorPadding, {
      duration: 250,
    }); // for example on second tab: 2 * 50 + padding
  }, [state.index, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="flex-row bg-white  pb-2  relative border-t border-gray-200"
      onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
    >
      {/* Animated Tab Indicator */}
      {tabBarWidth > 0 && (
        <Animated.View
          className="absolute top-0 left-0 z-10 bg-dark rounded-b-lg h-1"
          style={[{ width: indicatorWidth }, indicatorStyle]}
        />
      )}

      {/*  */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            className={`flex-1 items-center justify-center py-2 pb-safe`}
          >
            {options.tabBarIcon && route.name !== "rufus" ? (
              options.tabBarIcon({
                focused: isFocused,
                color: "black",
                size: 24,
              })
            ) : (
              <Image source={rufusIcon} style={{ width: 40, height: 40 }} />
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
}
