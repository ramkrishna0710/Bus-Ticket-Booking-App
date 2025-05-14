import { View, Text, SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UserCircleIcon } from 'react-native-heroicons/solid'
import Bookings from '../../components/home/Bookings'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { navigate } from '../../utils/NavigationUtils'

interface UserInfo {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}


const HomeScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await GoogleSignin.getCurrentUser();
        setUserInfo(user?.user || null);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <View className='flex-1 bg-white'>
      <SafeAreaView />
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'}/>

      <View className='flex-row justify-between items-center px-4 py-2'>
        <View className='flex-row justify-between items-center'>
          <Text className='font-bold text-3xl'>
            Bus Tickets
          </Text>
          <Image source={require('../../assets/images/sidebus.png')} className='h-10 w-10 ml-3' />
        </View>

        {/* <UserCircleIcon color={'red'} size={38} onPress={logout} /> */}

        <View className='flex-row items-center'>
          {userInfo?.photo ? (
            <TouchableOpacity
              onPress={() => navigate('LogoutScreen', { userInfo })}
            >
              <Image
                source={{ uri: userInfo?.photo }}
                style={{ width: 38, height: 38, borderRadius: 19 }}
              />
            </TouchableOpacity>
          ) : (
            <UserCircleIcon color={'red'} size={38} />
          )}
        </View>
      </View>

      <Bookings />
    </View>
  )
}

export default HomeScreen