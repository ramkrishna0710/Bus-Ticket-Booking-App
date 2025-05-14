import { View, Text, Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useMutation } from '@tanstack/react-query';
import { loginWithGoogle } from '../../service/requests/auth';
import { resetAndNavigate } from '../../utils/NavigationUtils';

GoogleSignin.configure({
  webClientId: '757858665143-gv25r107uhqs9jl4vf6bfe4jhorj397v.apps.googleusercontent.com',
  iosClientId: '757858665143-3jtp1nul3ct2kbejar732o2tvtoe31de.apps.googleusercontent.com'
});

const LoginScreen = () => {

  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      resetAndNavigate('HomeScreen');
    },
    onError: (error) => {
      console.error("Login failed", error);
    }
  });

  const handleGoogleSignin = async () => {
    try {
      setIsLoading(true)
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      loginMutation.mutate(response.data?.idToken as string);
    } catch (error) {
      console.error('Google Signin error', error);
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size={'large'} color={'teal'} />
        <Text className='text-gray-500 mt-2'>Login...</Text>
      </View>
    );
  }

  return (
    <View>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />

      <Image
        source={require('../../assets/images/cover.jpeg')}
        className='w-full h-64 bg-cover'
      />
      <View className='p-4'>
        <Text className='font-okra font-semibold text-xl text-center'>
          Create account or Sign in
        </Text>
        <View className='my-4 mt-12 border-1 gap-2 border border-black px-2 flex-row items-center'>
          <Text className='font-okra w-[10%] font-bold text-base ml-3'>
            +91
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
            keyboardType='number-pad'
            placeholder='Enter 10 digit phone number'
            className='font-okra h-11 w-[90%]'
          />
        </View>

        <TouchableOpacity
          onPress={handleGoogleSignin}
          className='bg-tertiary justify-center items-center p-3'
        >
          <Text className='text-white font-semibold font-okra'>
            LETS GO
          </Text>
        </TouchableOpacity>

        <Text className='text-center my-8 text-sm font-okra text-gray-700'>
          ------ OR ------
        </Text>

        <View className='flex items-center justify-center flex-row gap-4'>
          <TouchableOpacity
            onPress={handleGoogleSignin}
            className='border border-1 border-gray-300 p-2'
          >
            <Image
              source={require('../../assets/images/google.png')}
              className='w-5 h-5 contain-size'
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            className='border border-1 border-gray-300 p-2'
          >
            <Image
              source={require('../../assets/images/apple.png')}
              className='w-5 h-5 contain-size'
            />
          </TouchableOpacity>
        </View>

        <Text className='font-okra text-sm text-gray-500 font-medium text-center mt-10 w-72 self-center'>
          By Signing up you agree to our Terms and Conditions and Privacy Policy.
        </Text>
      </View>
    </View>
  )
}

export default LoginScreen