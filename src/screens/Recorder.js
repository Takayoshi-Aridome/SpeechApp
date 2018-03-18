import React from 'react';
import { Platform, StyleSheet, View, Button, Text, TouchableOpacity, Alert } from 'react-native';
//rooting
import { StackNavigator } from 'react-navigation';
//recording
import { AudioRecorder, AudioUtils } from 'react-native-audio'
//sound
import Sound from 'react-native-sound';
//fileSystem network
import RNFetchBlob from 'react-native-fetch-blob';
//binary
import { Buffer } from 'buffer/';

export default class Recorder extends React.Component {

  constructor (props) {
    super(props)

    this.audioFile = {
      name: 'voice.wav',
      binary: null,
      buffer: null,
    }

    this.audioOptions = {
      SampleRate: 44100.0,
      Channels: 2,
      AudioQuality: "High",
      AudioEncoding: "lpcm",
    }

    this.IBMCloud = {
      ws: null,
    }

    this.recording = this._recording.bind(this);
    this.createAudioBuffer = this._createAudioBuffer.bind(this);
    this.connectToIBMCloud = this._connectToIBMCloud.bind(this);

    this.state = {
      isRecording: false,
      mark: '●',
    }
  }

  _recording() {
    if (!this.state.isRecording) {
      this._startRecording(
        RNFetchBlob.fs.dirs.DocumentDir + '/' + this.audioFile.name,
        this.audioOptions,
      );
      this.setState({isRecording: true, mark: '■'});
    } else {
      this._stopRecording();
      this.setState({isRecording: false, mark: '●'})
    }
  }

  async _startRecording(audioFileUri, audioOptions) {
    AudioRecorder.prepareRecordingAtPath(audioFileUri, audioOptions);
    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error('startRecording: ', error);
    }
  }

  async _stopRecording() {
    try {
      const filePath = await AudioRecorder.stopRecording();
    } catch (error) {
      console.error('stopRecording: ', error);
    }
  }

  componentDidMount() {
    AudioRecorder.onFinished = (data) => {
      this.createAudioBuffer(
        RNFetchBlob.fs.dirs.DocumentDir + '/' + this.audioFile.name,
        this.connectToIBMCloud
      );
    }
    AudioRecorder.onProgress = () => {}
  }

  _createAudioBuffer(audioFileUri, onCompleteHandler) {
    let _audioFileUri = audioFileUri;
    let _audioFileBinary = '';
    let _audioFileBuffer = null;
    RNFetchBlob.fs.readStream(_audioFileUri, 'base64', 4095).then((ifstream) => {
      ifstream.open();
      ifstream.onData((chunk) => {
        _audioFileBinary += chunk;
      });
      ifstream.onError((error) => {
        console.log('readStream: ', error);
      });
      ifstream.onEnd(() => {
          _audioFileBuffer = Buffer.from(_audioFileBinary, 'base64');
          this.audioFile.uri = _audioFileUri;
          this.audioFile.binary = _audioFileBinary;
          this.audioFile.buffer = _audioFileBuffer;
          onCompleteHandler();
      });
    });
  }

  _connectToIBMCloud() {
    this.IBMCloud.ws = new WebSocket('wss://tawork.mybluemix.net/ws/test');
    let _ws = this.IBMCloud.ws;

    _ws.onopen = () => {
      _ws.send(this.audioFile.buffer);
    };
    _ws.onmessage = (event) => {
      console.log(event);
    };
    _ws.onerror = (event) => {
      console.log(event.message);
    };
    _ws.onclose = (event) => {
      console.log(event.code, event.reason);
    };
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
