/**
 * Sample React Native App
**/
console.disableYellowBox = true;
import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Home from './src/screens/Home';
import Details from './src/screens/Details';
import Recorder from './src/screens/Recorder';
//import TestAudio from './src/utils/TestAudio';

const RootStack = StackNavigator(
  {
    Home: { screen: Home },
    Details: { screen: Details },
    Recorder: { screen: Recorder },
    //TestAudio: { screen: TestAudio },

  },
  { initialRouteName: 'Recorder' }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
