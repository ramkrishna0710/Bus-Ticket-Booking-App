import { View, Text, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView, ScrollView, StatusBar, Linking } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { bookTicket, fetchBusDetails } from '../../service/requests/bus';
import { useMutation, useQuery } from '@tanstack/react-query';
import { goBack, resetAndNavigate } from '../../utils/NavigationUtils';
import { ArrowLeftIcon, StarIcon } from 'react-native-heroicons/solid';
import TicketModal from '../../components/ui/TicketModal';
import PaymentButton from '../../components/ui/PaymentButton';
import Seat from '../../components/ui/Seat';

const SeatSelectionScreen = () => {
    const [ticketVisible, setTicketVisible] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const route = useRoute();
    const { busId } = route?.params as { busId: string };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['busDetails', busId],
        queryFn: () => fetchBusDetails(busId),
    });

    const busInfo = data;
    console.log("BUS INFO : ", busInfo);


    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [busId]),
    );

    const bookTicketMutation = useMutation({
        mutationFn: (ticketData: {
            busId: string;
            date: string;
            seatNumbers: number[];
        }) => bookTicket(ticketData),
        onSuccess: data => {
            console.log('Ticket booked Successfullt', data);
            setTicketVisible(true);
        },
        onError: error => {
            console.error('Error booking ticket:', error);
            Alert.alert('Failed to book ticket. Plaese try again.')
        }
    });

    const handleSeatSelction = (seat_id: number) => {
        setSelectedSeats(prev =>
            prev.includes(seat_id)
                ? prev.filter(id => id !== seat_id)
                : [...prev, seat_id]
        );
    }

    const handleOnPay = () => {
        if (selectedSeats.length == 0) {
            Alert.alert('Please select at least one seat.');
            return;
        }
        bookTicketMutation.mutate({
            busId,
            date: new Date(busInfo.departureTime).toISOString(),
            seatNumbers: selectedSeats,
        });
    };

    // const handleOnPay = async () => {
    //     if (selectedSeats.length === 0) {
    //         Alert.alert('Please select at least one seat.');
    //         return;
    //     }

    //     // Replace this with your actual fare logic
    //     const farePerSeat = busInfo?.fare || 100;
    //     const totalAmount = farePerSeat * selectedSeats.length;

    //     const transactionRef = `TICKET-${Date.now()}`;
    //     const upiId = 'yourupiid@upi';
    //     const payeeName = 'Your Company Name';

    //     const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    //         payeeName
    //     )}&tr=${transactionRef}&tn=${encodeURIComponent(
    //         'Bus Ticket Payment'
    //     )}&am=${totalAmount}&cu=INR`;

    //     const supported = await Linking.canOpenURL(upiUrl);
    //     if (supported) {
    //         Linking.openURL(upiUrl);
    //     } else {
    //         Alert.alert(
    //             'No UPI App Found',
    //             'Please install a UPI-enabled app like Google Pay, PhonePe, or Paytm.'
    //         );
    //     }
    // };

    if (isLoading) {
        return (
            <View className='flex-1 items-center justify-center bg-white'>
                <ActivityIndicator size={'large'} color={'teal'} />
                <Text className='text-gray-500 mt-2'>Fetching bookings...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className='flex-1 items-center justify-center bg-white'>
                <Text className='text-red-500'>Failed to load bus details.</Text>
                <TouchableOpacity
                    onPress={() => goBack()}
                    className='mt-4 px-4 py-2 bg-blue-500 rounded'>
                    <Text className='text-white font-semibold'>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View className='flex-1 bg-white'>
            <SafeAreaView />
            <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />


            <View className='bg-white p-4 flex-row items-center border-b-[1px] border-teal-400'>
                <TouchableOpacity
                    onPress={goBack}
                >
                    <ArrowLeftIcon size={24} color="#000" />
                </TouchableOpacity>

                <View className='ml-4'>
                    <Text className='text-lg font-bold'>Seat Selection</Text>
                    <Text className='text-sm text-gray-500'>
                        {busInfo?.from} ➡ {busInfo?.to}
                    </Text>
                    <Text className='text-sm text-gray-500'>
                        {new Date(busInfo?.departureTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}{' '}
                        {new Date(busInfo?.departureTime).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 200 }}
                className='pb-20 bg-teal-100 p-4'
            >
                <Seat
                    selectedSeats={selectedSeats}
                    seats={busInfo?.seats}
                    onSeatSelect={handleSeatSelction}
                />

                <View className='bg-white rounded-lg p-4 drop-shadow-sm'>
                    <View className='flex-row justify-between items-center mb-2'>
                        <Text className='text-lg font-semibold'>{busInfo?.company}</Text>
                        <View className='flex-row items-center'>
                            <StarIcon size={18} color={'gold'} />
                            <Text className='ml-1 text-gray-600 text-sm'>
                                {busInfo?.rating} ({busInfo?.totalReviews})
                            </Text>
                        </View>
                    </View>

                    <Text className='text-sm text-gray-600 mb-1'>{busInfo?.busType}</Text>

                    <View className='flex-row justify-between mt-2'>
                        <View className='items-center'>
                            <Text className='text-lg font-bold'>
                                {new Date(busInfo?.departureTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                            <Text className='text-sm text-gray-500'>Departure</Text>
                        </View>

                        <Text className='text-sm text-gray-500'>{busInfo?.duration}</Text>
                        <View className='items-center'>
                            <Text className='text-lg font-bold'>
                                {new Date(busInfo?.arrivalTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                            <Text className='text-sm text-gray-500'>Arrival</Text>
                        </View>
                    </View>

                    <Text className='mt-3 text-green-600 text-sm'>
                        <Text className='mt-3 text-green-600 text-sm'>
                            {
                                busInfo?.seats?.flat().filter((seat: any) => !seat.booked).length
                            }{' '}
                            Seats Available
                        </Text>
                    </Text>

                    <View className='flex-row items-center mt-2'>
                        <Text className='text-gray-400 line-through text-lg'>
                            ₹{busInfo?.originalPrice}
                        </Text>
                        <Text className='text-black ml-2 font-bold text-xl'>
                            ₹{busInfo?.price} (1/p)
                        </Text>
                    </View>

                    <View className='flex-row gap-2 mt-3'>
                        {busInfo?.badges?.map((badge: string, index: number) => (
                            <View
                                key={index}
                                className='bg-yellow-200 px-2 py-1 rounded-full'
                            >
                                <Text className='text-xs text-yellow-800 font-semibold'>{badge}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <PaymentButton
                seat={selectedSeats.length}
                price={busInfo.price}
                onPay={handleOnPay}
            />

            {ticketVisible && (
                <TicketModal
                    bookingInfo={{
                        from: busInfo?.from,
                        to: busInfo?.to,
                        departureTime: new Date(busInfo.departureTime).toLocaleTimeString(
                            [],
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                            },
                        ),
                        arrivalTime: new Date(busInfo.arrivalTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        date: new Date(busInfo.departureTime).toDateString(),
                        company: busInfo.company,
                        busType: busInfo.busType,
                        seats: bookTicketMutation.data?.seatNumbers,
                        ticketNumber: bookTicketMutation.data?._id || 'RAM5678941236',
                        pnr: bookTicketMutation.data?.pnr || 'PNR72113989',
                        fare: `${busInfo.price * selectedSeats.length}`,
                    }}
                    onClose={() => {
                        resetAndNavigate('HomeScreen');
                        setTicketVisible(false)
                    }}
                    visible={ticketVisible}
                />
            )}
        </View>
    )
}

export default SeatSelectionScreen