import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native'
import React, { FC } from 'react'
import { ArrowUpOnSquareIcon, XMarkIcon } from 'react-native-heroicons/solid';
import Svg, { Circle, Line } from 'react-native-svg';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  bookingInfo: any;
}

const TicketModal: FC<TicketModalProps> = ({
  visible,
  onClose,
  bookingInfo
}) => {

  const createPDFAndShare = async () => {
    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        background-color: rgba(0, 0, 0, 0.5);
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .ticket-container {
        background-color: white;
        width: 90%;
        max-width: 500px;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      }
      .title {
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 12px;
      }
      .section {
        background-color: #f3f3f3;
        padding: 12px;
        border-radius: 10px;
        margin-top: 12px;
      }
      .section-title {
        color: #444;
        font-weight: 600;
      }
      .section-subtext {
        color: #666;
        font-size: 14px;
        margin-top: 4px;
      }
      .dashed-line {
        width: 100%;
        border-top: 2px dashed gray;
        margin: 24px 0;
      }
      .fare {
        font-size: 18px;
        font-weight: bold;
        color: #059669;
        margin-top: 8px;
      }
    </style>
  </head>
  <body>
    <div class="ticket-container">
      <div class="title">Your Ticket</div>

      <div class="section">
        <div class="section-title">${bookingInfo.from} ➡ ${bookingInfo.arrivalTime},${' '}
                            ${bookingInfo.date}</div>
      </div>

      <div class="section">
        <div class="section-title">${bookingInfo.company}</div>
        <div class="section-subtext">${bookingInfo.busType}</div>
      </div>

      <div class="section">
        <div class="section-title">Seats No.</div>
        <div class="section-subtext">${bookingInfo?.seats?.toString()}</div>
      </div>

      <div class="dashed-line"></div>

      <div class="section">
        <div class="section-title">Ticket #: ${bookingInfo.ticketNumber}</div>
        <div class="section-title">PNR #: ${bookingInfo.pnr}</div>
        <div class="fare">₹${bookingInfo.fare}</div>
      </div>

    </div>
  </body>
</html>
`;


      const options = {
        html: htmlContent,
        fileName: 'ticket',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      if (file?.filePath) {
        await Share.open({
          url: `file://${file.filePath}`,
          type: 'application/pdf',
          title: 'Share Ticket',
        });
      } else {
        throw new Error('PDF generation failed.');
      }
    } catch (error) {
      Alert.alert('Error', (error as any)?.message || 'Failed to create PDF');
    }
  };

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View
        className='flex-1 justify-center items-center'
        style={{ backgroundColor: '#2A2526' }}
      >
        <TouchableOpacity className='bg-white mb-5 shadow-sm p-1 rounded-full' onPress={onClose}>
          <XMarkIcon color={'black'} size={22} />
        </TouchableOpacity>

        <View className='bg-white overflow-hidden rounded-xl w-[90%] p-4 shadow-lg relative'>
          <Text className='text-center text-lg font-bold mb-2'>
            Your Ticket
          </Text>

          <View className='absolute left-[-14px] top-[54%] -translate-y-1/2'>
            <Svg height="40" width="28">
              <Circle cx="14" cy="20" r="14" fill="#2A2526" />
            </Svg>
          </View>

          <View className='absolute right-[-14px] top-[54%] -translate-y-1/2'>
            <Svg height="40" width="28">
              <Circle cx="14" cy="20" r="14" fill="#2A2526" />
            </Svg>
          </View>

          <View className='bg-gray-100 p-3 rounded-lg'>
            <Text className='text-gray-700 font-semibold'>
              {bookingInfo.from} ➡ {bookingInfo.arrivalTime},{' '}
              {bookingInfo.date}
            </Text>
          </View>

          <View className='mt-3'>
            <Text className='text-gray-700'>{bookingInfo.company}</Text>
            <Text className='text-gray-500 text-sm'>{bookingInfo.busType}</Text>
          </View>

          <View className='mt-3'>
            <Text className='text-gray-700'>Seats No.</Text>
            <Text className='text-gray-500 text-sm'>{bookingInfo?.seats?.toString()}</Text>
          </View>

          <View className='my-6 w-full '>
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="gray"
                strokeWidth="2"
                strokeDasharray="6,6"
              />
            </Svg>
          </View>

          <View className='mt-3'>
            <Text className='text-gray-700'>
              Ticket #: {bookingInfo.ticketNumber}
            </Text>
            <Text className='text-gray-700'>PNR #: {bookingInfo.pnr}</Text>
            <Text className='text-lg font-bold text-green-600 mt-2'>
              ₹{bookingInfo.fare}
            </Text>
          </View>

          <TouchableOpacity onPress={createPDFAndShare} className='bg-red-500 flow-root gap-2 p-3 rounded-lg mt-4 justify-center items-center'>
            <ArrowUpOnSquareIcon color="white" />
            <Text className='text-white font-semibold'>Share your ticket</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

export default TicketModal