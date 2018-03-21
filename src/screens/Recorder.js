import React from 'react';
import { Platform, StyleSheet, View, Button, Text, TouchableOpacity, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';
import { Buffer } from 'buffer/';

const bluemixUrls = {'places': 'wss://taspeechapp.mybluemix.net/speech/places',};
const record = {'name': 'record', 'type': 'wav',};
const announce = {'name': 'announce','type': 'mp3',};

export default class Recorder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {isRecording: false, mark: '●',};
    this.audioFiles = {};
    this.audioOptions = {'SampleRate': 44100.0, 'Channels': 2, 'AudioQuality': "High", 'AudioEncoding': "lpcm",};
    this.connections = {};
    this.recording = this._recording.bind(this);
    this.createAudioBuffer = this._createAudioBuffer.bind(this);
    this.getPlaces = this._getPlaces.bind(this);

    Sound.setCategory('Playback');
  }

  _recording() {
    if (!this.state.isRecording) {
      this._startRecording(record.name, record.type, this.audioOptions);
      this.setState({isRecording: true, mark: '■'});
    } else {
      this._stopRecording();
      this.setState({isRecording: false, mark: '●'})
    }
  }

  async _startRecording(audioFileName, audioFileType, audioOptions) {
    let _audioFile = { 'name': audioFileName, 'type': audioFileType,};
    let _audioFileUri = RNFetchBlob.fs.dirs.DocumentDir + '/' + audioFileName + '.' + audioFileType;
    this.audioFiles[audioFileName] = _audioFile;
    AudioRecorder.prepareRecordingAtPath(_audioFileUri, audioOptions);
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
      this.createAudioBuffer(record.name, record.type);
    }
    AudioRecorder.onProgress = () => {}
  }

  _createAudioBuffer(audioFileName, audioFileType) {
    let _audioFile = {
      'name': audioFileName,
      'type': audioFileType,
      'uri': RNFetchBlob.fs.dirs.DocumentDir + '/' + audioFileName + '.' + audioFileType,
      'binary': '',
      'buffer': null,
    };

    RNFetchBlob.fs.readStream(_audioFile.uri, 'base64', 4095).then((stream) => {
      stream.open();
      stream.onData((chunk) => {
        _audioFile.binary += chunk;
      });
      stream.onError((error) => {
        console.log('readStream: ', error);
      });
      stream.onEnd(() => {
          _audioFile.buffer = Buffer.from(_audioFile.binary, 'base64');
          this.audioFiles[audioFileName] = _audioFile;
          this.getPlaces(bluemixUrls.places, _audioFile.buffer);
      });
    });
  }

  _getPlaces(socketUrl, socketInput) {
    let _connection = { 'url': socketUrl, 'input': socketInput, };
    let _ws = new WebSocket(_connection.url+'/debug');

    _ws.onopen = () => { _ws.send(_connection.input); };
    _ws.onmessage = (event) => {
      _ws.close();
      _connection['output'] = JSON.parse(event.data);
      this.connections['places'] =_connection;
      this._writeAudioFile(announce.name, announce.type, _connection['output'].audioBuffer.data);
    };
    _ws.onerror = (event) => { console.log(event.message); };
    _ws.onclose = (event) => { console.log('onclose: ', event); };
  }

  _writeAudioFile(audioFileName, audioFileType, audioBuffer) {
    console.log('_writeAudioFile:');
    let _audioFile = {
      'name': audioFileName,
      'type': audioFileType,
      'uri': RNFetchBlob.fs.dirs.DocumentDir + '/' + audioFileName + '.' + audioFileType,
      'buffer': audioBuffer,
    };

    RNFetchBlob.fs.writeFile(_audioFile.uri, _audioFile.buffer, 'ascii').then(() => {
      this.audioFiles[audioFileName] = _audioFile;
      this._createSound(announce.name, announce.type);
    });
  }

  _createSound(audioFileName, audioFileType) {
    let _sound = new Sound(audioFileName + '.' + audioFileType, RNFetchBlob.fs.dirs.DocumentDir, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      _sound.play();
    });
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
