import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import Item from './Item';

const DevicesScreen = () => {
  const {list} = useSelector(state => state);
  return (
    <ScrollView>
      {list.length === 0 ? (
        <Text>Tidak ada perangkat, pastikan bluetooth telah aktif</Text>
      ) : (
        <View>
          {list.map(item => (
            <Item key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default DevicesScreen;
