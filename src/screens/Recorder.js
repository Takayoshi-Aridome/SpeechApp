import React from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Alert } from 'react-native';
//rooting
import { StackNavigator } from 'react-navigation';
//recording
import { AudioRecorder, AudioUtils } from 'react-native-audio'

export default class Recorder extends React.Component {
  constructor (props) {
    super(props)

    this.recording = this._recording.bind(this)
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
      mark: '●',
    }
  }

  _recording() {
    if (!this.state.isRecording) {
      this.setState({isRecording: true, mark: '■'});
      Alert.alert(this.state.file.path + this.state.file.name);
      /*
      AudioRecorder.prepareRecordingAtPath(
        this.state.file.path + this.state.file.name,
        this.state.config
      );
      AudioRecorder.startRecording()
      */
    } else {
      this.setState({isRecording: false, mark: '●'})
      Alert.alert("_onPressHandler:false");
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
