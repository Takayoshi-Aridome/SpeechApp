/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  Button,
  Text,
  View
} from 'react-native';

import axios from 'axios';

export default class TestBlumix extends Component {
  _onPressButton() {
    axios.get('https..............',
    {params: {ID: 12345}})
    .then(function (response) {
      console.log(response.data);
      Alert.alert(response.data);
    })
    .catch(function (error) {
      console.log(error);
      //Alert.alert(error);
    });
    //Alert.alert('You tapped the button!')
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Button
            onPress={this._onPressButton}
            title="This looks great!"
          />
        <Text style={styles.instructions}>
          Welcome to React Native!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
