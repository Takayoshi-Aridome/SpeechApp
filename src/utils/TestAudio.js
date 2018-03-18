import React from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Alert } from 'react-native';

import { Buffer } from 'buffer/';
import RNFetchBlob from 'react-native-fetch-blob';
import Sound from 'react-native-sound';
//import Audios from './../../assets/Audios';
import Images from './../../assets/Images';

export default class TestAudio extends React.Component {

  constructor (props) {
    super(props)


    this.onPress = this._onPress.bind(this);
  }
  _onPress() {
    let data = ''
    RNFetchBlob.fs.readStream(
        // encoding, should be one of `base64`, `utf8`, `ascii`
        'utf8',
        // file path
        Images.reactIcon,
        // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
        // when reading file in BASE64 encoding, buffer size must be multiples of 3.
        4096)
    .then((ifstream) => {
        ifstream.open()
        ifstream.onData((chunk) => {
          // when encoding is `ascii`, chunk will be an array contains numbers
          // otherwise it will be a string
          data += chunk
        })
        ifstream.onError((err) => {
          console.log('oops', err)
        })
        ifstream.onEnd(() => {
          console.log('data: ',data);
        })
    })
  }

  render() {
    return (
      <View>
        <Button
          onPress={this.onPress}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}
