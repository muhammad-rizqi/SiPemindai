/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import BleManager from 'react-native-ble-manager';
import {useDispatch} from 'react-redux';
import DevicesScreen from './DevicesScreen';
import LogScreen from './LogScreen';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BluetoothScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();

  const dispatch = useDispatch();

  const setList = devices => {
    dispatch({
      type: 'CHANGE_DEVICES',
      payload: devices,
    });
  };

  const setLoger = log => {
    dispatch({
      type: 'CHANGE_LOG',
      payload: log,
    });
  };

  useEffect(() => {
    if (!isScanning) {
      setTimeout(() => {
        startScan();
      }, 10000);
    }
  }, [isScanning]);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3, false)
        .then(_ => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleStopScan = () => {
    writeLog();
    console.log('Scan is stopped');
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = data => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  };

  const handleDiscoverPeripheral = peripheral => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  };

  const writeLog = () => {
    const log = {};
    log.time = new Date();
    log.data = Array.from(peripherals.values());
    setLoger(log);
  };

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    BleManager.start({showAlert: false});
    startScan();
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(res => {
            if (res) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    return () => {
      console.log('unmount');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.body}>
        <View style={styles.rowTitle}>
          <Text style={styles.h1}>SiPemindai</Text>
          {isScanning && <ActivityIndicator color="#004D40" size="large" />}
        </View>
        <View style={styles.body}>
          <Tab.Navigator
            tabBarOptions={{indicatorStyle: {backgroundColor: '#004D40'}}}>
            <Tab.Screen
              name="Devices"
              options={{tabBarLabel: 'Perangkat'}}
              component={DevicesScreen}
            />
            <Tab.Screen name="Log" component={LogScreen} />
          </Tab.Navigator>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  h1: {fontSize: 24, fontWeight: 'bold'},
  body: {
    backgroundColor: 'white',
    flex: 1,
  },
  rowTitle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 16,
    height: 30,
  },
});

export default BluetoothScreen;
