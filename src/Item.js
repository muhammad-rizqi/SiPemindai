/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {calculate} from './helper';

const Item = ({item, onPress}) => {
  const color = item.connected ? '#80CBC4' : '#fff';

  return (
    <TouchableHighlight onPress={() => {}}>
      <View
        style={{
          backgroundColor: color,
          flexDirection: 'row',
          padding: 8,
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={{fontSize: 12}}>{item.id}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text>{calculate(item.rssi)} m</Text>
          <Text style={{fontSize: 12}}>RSSI: {item.rssi}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default Item;
