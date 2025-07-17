import { SignedOut } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  return (
    <View>
      <Text className="text-2xl dark:text-white font-bold">Profile</Text>
      <SignedOut>
        <View className="pt-10 px-8 items-center">
          <Text className="text-3xl text-center">
            Sign in for the optimal experience
          </Text>
        </View>
        <View className="mt-8 w-full px-8">
          <Link href="/signin" asChild>
            <TouchableOpacity className="bg-primary py-3 px-4 border border-dark">
              <Text className="text-center text-base text-dark">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
