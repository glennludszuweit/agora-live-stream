import { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Stream from './Stream';
import Home from './Home';
import './App.css';

const rtc = {
  client: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
  localAudioTrack: null,
  localVideoTrack: null,
};

let options = {
  appId: '1b7ea0a481c94dafa4fd08a4f78076cc',
  channel: 'TEST',
  token: null,
  role: 'host',
};

function App() {
  const [audiences, setAudiences] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [channels, setChannels] = useState([]);

  const createStream = async (channelName) => {
    await rtc.client.join(options.appId, channelName, options.token, null);

    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack.play('host');
    rtc.localAudioTrack.play();

    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
  };

  const watchStream = () => {
    rtc.client.on('user-published', async (user, mediaType) => {
      await rtc.client.subscribe(user, mediaType);
      console.log('subscribe success');

      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        setAudiences([...audiences, user.uid.toString()]);
        remoteVideoTrack.play(user.uid.toString());
      }

      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });
  };

  const leaveStream = async () => {
    rtc.client.remoteUsers.forEach((user) => {
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });
    await rtc.client.leave();
  };

  const terminateStream = async () => {
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();
    rtc.client.remoteUsers.forEach((user) => {
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });
    await rtc.client.leave();
  };

  return (
    <Switch>
      <Route path='/:channel'>
        <Stream
          createStream={createStream}
          watchStream={watchStream}
          leaveStream={leaveStream}
          terminateStream={terminateStream}
          audiences={audiences}
        />
      </Route>
      <Route excact path='/'>
        <Home
          channelName={channelName}
          setChannelName={setChannelName}
          channels={channels}
          setChannels={setChannels}
        />
      </Route>
    </Switch>
  );
}

export default App;
