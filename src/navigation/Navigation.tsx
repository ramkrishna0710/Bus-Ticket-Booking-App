import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/splashscreen/SplashScreen';
import { navigationRef } from '../utils/NavigationUtils';
import HomeScreen from '../screens/home/HomeScreen';
import BusListScreen from '../screens/search/BusListScreen';
import SeatSelectionScreen from '../screens/seat/SeatSelectionScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName='SplashScreen'
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
                <Stack.Screen name='LoginScreen' component={LoginScreen} />
                <Stack.Screen name='LogoutScreen' component={LogoutScreen} />
                <Stack.Screen name='HomeScreen' component={HomeScreen} />
                <Stack.Screen name='BusListScreen' component={BusListScreen} />
                <Stack.Screen name='SeatSelectionScreen' component={SeatSelectionScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
