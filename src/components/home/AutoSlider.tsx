import React, { useRef, useEffect, useState } from 'react';
import { FlatList, Image, View, Dimensions } from 'react-native';

const images = [
  require('../../assets/images/adbanner.jpeg'),
  require('../../assets/images/sidebustwo.jpg'),
];

const { width } = Dimensions.get('window');

const AutoSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % images.length;
      setIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000); // change image every 3s

    return () => clearInterval(timer);
  }, [index]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Image
            source={item}
            className='h-40 rounded-lg my-4 w-full'
            style={{ width }}
            resizeMode='cover'
          />
        )}
      />
    </View>
  );
};

export default AutoSlider;
