import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid mobile number or email"),
  password: z.string().min(3, "Please enter your password"),
});
type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { isLoaded: isLoadedSignUp, signUp } = useSignUp();
  const { isLoaded: isLoadedSignIn, signIn, setActive } = useSignIn();
  const [showPassword, setShowPassword] = useState();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "hussainhamim83@gmail.com",
      password: "hello@dev##",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    if (!isLoadedSignIn) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.dismissTo("/(tabs)/profile");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        const errors = err.errors;
        if (errors[0].code === "form_identifier_not_found") {
          createAccount(data);
        } else {
          Alert.alert("Error", "An error occurred while signing in");
        }
      }
    }
  };

  const createAccount = async (data: SignInForm) => {
    //
  };

  const signInWithPasskey = async () => {
    //
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">
          Sign in or create an account
        </Text>
        <Text className="text-base font-medium mb-2">
          Enter mobile number or email
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mobile number or email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mb-2">{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border text-gray text-black border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Amazon password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              accessibilityLabel="Amazon password"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mb-2">{errors.password.message}</Text>
        )}

        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showPassword }}
          testID="show-password-checkbox"
        >
          <View
            className={`w-5 h-5 rounded border border-gray-400 mr-2 items-center justify-center ${
              showPassword ? "bg-green-100 border-green-600" : "bg-white"
            }`}
          >
            {showPassword && <View className="w-3 h-3 bg-green-600 rounded" />}
          </View>
          <Text className="text-base">Show password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-yellow-400 rounded-full py-3 items-center mb-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-lg font-medium text-black">Sign in</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
        <TouchableOpacity
          className="border border-gray-400 rounded-full py-3 items-center mb-6 bg-white"
          onPress={signInWithPasskey}
        >
          <Text className="text-lg font-medium text-black">
            Sign in with a passkey
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
