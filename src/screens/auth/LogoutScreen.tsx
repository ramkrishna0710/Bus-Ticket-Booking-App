import { View, Text, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import React from 'react';
import { goBack } from '../../utils/NavigationUtils';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useRoute } from '@react-navigation/native';
import { logout } from '../../service/requests/auth';

const LogoutScreen = () => {
    const route = useRoute();
    const { userInfo } = route.params as { userInfo: any };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView />
            <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />

            {/* Header */}
            <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
                <TouchableOpacity onPress={goBack} className="p-1">
                    <ArrowLeftIcon size={24} color="#000" />
                </TouchableOpacity>
                <Text className="ml-4 text-lg font-bold">Logout</Text>
            </View>

            {/* Profile Section */}
            <View className="items-center mt-10 px-4">
                <Image
                    source={{ uri: userInfo?.photo }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    className="mb-4"
                />
                <Text className="text-xl font-semibold text-gray-800">{userInfo?.name}</Text>
                <Text className="text-sm text-gray-500 mt-1">{userInfo?.email}</Text>
            </View>

            {/* Divider */}
            <View className="mt-10 mx-10 border-t border-gray-200" />

            {/* Logout Button */}
            <View className="flex-1 justify-end mb-10 px-6">
                <TouchableOpacity
                    onPress={logout}
                    className="bg-red-500 p-4 rounded-xl items-center shadow-md"
                >
                    <Text className="text-white font-bold text-base">LOG OUT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LogoutScreen;
