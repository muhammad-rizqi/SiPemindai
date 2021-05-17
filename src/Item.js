/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';

const Item = ({item, onPress}) => {
  const color = item.connected ? '#80CBC4' : '#fff';

  const calculate = rssi => {
    const distance = Math.pow(10, (-69 - rssi) / (10 * 2));
    return distance.toFixed(3);
  };

  return (
    <TouchableHighlight onPress={() => onPress()}>
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
