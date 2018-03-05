/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
**/
console.disableYellowBox = true;
import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Home from './src/screens/Home';
import Details from './src/screens/Details';
import Recorder from './src/screens/Recorder';

const RootStack = StackNavigator(
  {
    Home: { screen: Home },
    Details: { screen: Details },
    Recorder: { screen: Recorder },

  },
  { initialRouteName: 'Recorder' }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
