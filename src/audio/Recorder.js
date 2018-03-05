/**
 * AudioRecording
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  Alert
} from 'react-native';
//recording
import {AudioRecorder, AudioUtils} from 'react-native-audio';

export default class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _onPress() {
    Alert.alert("録音開始");
  }

  render() {
    return (
      <View style={styles.welcome}>
        <Button
          onPress={_onPress}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
