import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BluetoothScreen from './src/BluetoothScreen';
import {Provider} from 'react-redux';

import {createStore} from 'redux';
import reducer from './src/reducer';

const store = createStore(reducer);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BluetoothScreen />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
