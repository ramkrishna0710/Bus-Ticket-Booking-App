import { View, Text, Image, Alert, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { getAccessToken, getRefreshToken } from '../../service/storage';
import { resetAndNavigate } from '../../utils/NavigationUtils';
import { jwtDecode } from 'jwt-decode';
import { refresh_token } from '../../service/requests/auth';
import Animated, { FadeInDown } from 'react-native-reanimated'


interface DecodedToken {
  exp: number;
}

const SplashScreen = () => {

  const tokenCheck = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken() as string;

    if (accessToken) {
      const decodeAccessToken = jwtDecode<DecodedToken>(accessToken)
      const decodeRefreshToken = jwtDecode<DecodedToken>(refreshToken)

      const currentTime = Date.now() / 1000;

      if (decodeRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen');
        Alert.alert('Session Expired, please login again');
        return;
      }

      if (decodeAccessToken?.exp < currentTime) {
        const refreshed = await refresh_token();
        if (!refreshed) {
          Alert.alert('There was an error');
          resetAndNavigate('LoginScreen');
          return
        }
      }

      resetAndNavigate('HomeScreen')
      return;
    }

    resetAndNavigate('LoginScreen')
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      tokenCheck()
    }, 2500)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <View className='flex-1 justify-center bg-white items-center'>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />

      <Animated.Image
        source={require('../../assets/images/logo_t.png')}
        className="h-[30%] w-[60%]"
        resizeMode='contain'
        entering={FadeInDown.delay(400).duration(1000)}
      />

      <Animated.View
        className="justify-center items-center"
        entering={FadeInDown.delay(400).duration(1000)}
      >
        <Text className='text-xl font-okra font-bold'>One Ticket. Endless Destinations.</Text>
        <Text className='text-xl'>🌍🚍🧳</Text>
      </Animated.View>

      <Animated.Text
        className="absolute font-bold bottom-0 mb-20 text-sm text-center text-gray-800 px-6"
        entering={FadeInDown.delay(400).duration(1000)}
      >
        R A M • 1.1.0
      </Animated.Text>

    </View>
  )
}

export default SplashScreen