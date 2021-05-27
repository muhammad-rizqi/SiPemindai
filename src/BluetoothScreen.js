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
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import BleManager from 'react-native-ble-manager';
import {useDispatch} from 'react-redux';
import DevicesScreen from './DevicesScreen';
import LogScreen from './LogScreen';
import {useSelector} from 'react-redux';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BluetoothScreen = () => {
  const [isScanning, setIsScanning] = useState(false);

  const {peripherals} = useSelector(state => state);
  const dispatch = useDispatch();

  const setPeripherals = peripheral => {
    dispatch({
      type: 'CHANGE_PERIPHERALS',
      payload: peripheral,
    });
  };

  const cleanPeripherals = () => {
    dispatch({
      type: 'CLEAR_PERIPHERALS',
    });
  };

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
    setTimeout(() => {
      startScan();
    }, 15000);
  }, [isScanning]);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, false)
        .then(_ => {
          setIsScanning(true);
          console.log('Scanning...');
          cleanPeripherals();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    writeLog();
    console.log('Scan is stopped');
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      setPeripherals(peripheral);
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
    setPeripherals(peripheral);
    setList(Array.from(peripherals.values()));
  };

  const writeLog = () => {
    const log = {};
    log.time = new Date();
    log.data = Array.from(peripherals.values());
    setLoger(log);
  };

  const Tab = createMaterialTopTabNavigator();

  const checkPermission = () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(result => {
      if (result) {
        console.log('Permission is OK');
        startScan();
      } else {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]).then(res => {
          if (res) {
            startScan();
            console.log('User accept');
          } else {
            console.log('User refuse');
          }
        });
      }
    });
  };

  useEffect(() => {
    checkPermission();
    BleManager.start({showAlert: false});
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
