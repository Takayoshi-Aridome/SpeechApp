import React from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Alert } from 'react-native';
//rooting
import { StackNavigator } from 'react-navigation';
//recording
import { AudioRecorder, AudioUtils } from 'react-native-audio'
//sound
import Sound from 'react-native-sound';

import RNFetchBlob from 'react-native-fetch-blob';
import { Buffer } from 'buffer/';

export default class Recorder extends React.Component {

  constructor (props) {
    super(props)
    this.recording = this._recording.bind(this);
    Sound.setCategory('Playback');

    this.testBuffer = function() {
      console.log("==== testBuffer:function ==== start");
      var str1 = Buffer.from('hello', 'base64');
      var str2 = Buffer.from('hello').toString('base64');
      var _buffer = new Buffer('hello');
      var str3 = _buffer.toString('base64');
      var str4 = new Buffer('hello').toString('base64');

      //LOG::
      console.log("str1: ", str1); // str1:  Uint8Array(4) [133, 233, 101, 160]
      console.log("str2: ", str2); // str2:  aGVsbG8=
      console.log("str3: ", str3); // str3:  aGVsbG8=
      console.log("str4: ", str4); // str4:  aGVsbG8=
      console.log("---- testBuffer:function ---- end");
    }();

    this.testRNFetchBlobFsDirs = function() {
      console.log("==== testRNFetchBlobFsDirs:function ==== start");
      const { fs, fetch, wrap } = RNFetchBlob;
      const dirs = RNFetchBlob.fs.dirs;
      console.log("dirs.DocumentDir: ", dirs.DocumentDir);
      console.log("dirs.CacheDir: ", dirs.CacheDir);
      console.log("---- testRNFetchBlobFsDirs:function ---- end");
    }();

    this.state = {
      file: {
        data: {},
        path: AudioUtils.DocumentDirectoryPath + '/',
        name: 'speech.aac'
      },
      config: {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'aac',
        AudioEncodingBitRate: 32000
      },
      isRecording: false,
      recordingTime: 0,
      mark: '●',
    }
  }

  _recording() {
    if (!this.state.isRecording) {
      this._startRecording(this.state);
      this.setState({isRecording: true, mark: '■', recordingTime: 0});
    } else {
      this._stopRecording(this.state);
      this.setState({isRecording: false, mark: '●'})
    }
  }

  async _startRecording(state) {
    //Alert.alert(state.file.path + state.file.name);
    AudioRecorder.prepareRecordingAtPath(
      state.file.path + state.file.name,
      state.config
    );
    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  async _stopRecording(state) {
    //Alert.alert("_onPressHandler:false");
    try {
      const filePath = await AudioRecorder.stopRecording();
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    AudioRecorder.onFinished = (data) => {
      let _voice = new Sound(data.audioFileURL, '', (error) => {
        if (error) {Alert.alert('failed to load the sound', error);}
        _voice.play();
      });
    }

    AudioRecorder.onProgress = ({ currentTime }) => {
      this.setState({ recordingTime: Math.floor(currentTime) })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={styles.recordButton} onPress={this.recording}>
          <Text style={styles.playIcon}>{this.state.mark}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playIcon: {
    fontSize: 40,
    lineHeight:40,
    color: 'darkred',
    textAlign: 'center',
    margin: 10,
    padding: 0,
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'darkred',
    margin: 20,
    padding: 0,
  },
});
