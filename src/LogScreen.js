/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {calculate} from './helper';
import RNFS from 'react-native-fs';

const LogScreen = () => {
  const {loger} = useSelector(state => state);
  const dispatch = useDispatch();

  const writeToJSONFile = () => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    var path =
      RNFS.DownloadDirectoryPath + '/sipemindai-' + timestamp + '.json';

    RNFS.writeFile(path, JSON.stringify(loger), 'utf8')
      .then(_ => {
        console.log('FILE WRITTEN!' + path);
        ToastAndroid.show('Data tersimpan di \n' + path, ToastAndroid.LONG);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const writeToTXTFile = () => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    var path = RNFS.DownloadDirectoryPath + '/sipemindai-' + timestamp + '.txt';

    let data = '';
    loger.forEach(logs => {
      data = data + `\n[${logs.time.toISOString()}]\n`;
      logs.data.forEach((device, index) => {
        data =
          data +
          `${index + 1} - ${device.id} | ${device.name} | RSSI ${
            device.rssi
          } | ${calculate(device.rssi)} m\n`;
      });
    });

    RNFS.writeFile(path, data, 'utf8')
      .then(_ => {
        console.log('FILE WRITTEN!' + path);
        ToastAndroid.show('Data tersimpan di \n' + path, ToastAndroid.LONG);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const deleteLog = () => {
    dispatch({
      type: 'DELETE_LOG',
    });
    ToastAndroid.show('Log dihapus', ToastAndroid.LONG);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{paddingHorizontal: 8}}>
        {loger.map(log => (
          <View key={log.time.toISOString()}>
            <Text>
              {'\n'}[{log.time.toISOString()}]{' '}
            </Text>
            {log.data.map((device, index) => (
              <Text key={log.time.toISOString() + device.id}>
                {index + 1} - {device.id} | {device.name} | RSSI {device.rssi} |{' '}
                {calculate(device.rssi)} m
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.button} onPress={() => deleteLog()}>
          <Text style={styles.textGreen}>Hapus Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.activeButton]}
          onPress={writeToJSONFile}>
          <Text style={styles.textWhite}>Export JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.activeButton]}
          onPress={writeToTXTFile}>
          <Text style={styles.textWhite}>Export Text</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogScreen;

const styles = StyleSheet.create({
  textGreen: {color: '#004D40'},
  textWhite: {color: 'white'},
  button: {
    flex: 1,
    padding: 8,
    margin: 8,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: '#004D40',
  },
  activeButton: {
    backgroundColor: '#004D40',
  },
});
