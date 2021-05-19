import React, { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from './hooks/useAgora';
import MediaPlayer from './MediaPlayer';
import './styles/callStyles.scss';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

function Call() {

  const [appid, setAppid] = useState('2d265eac4ca3480688a95fa45278a645');
  const [token, setToken] = useState('0062d265eac4ca3480688a95fa45278a645IACw5/MR/Ax/1EpKyvWnyoHE1i/P0v2RO49JuYMiB99oyrLdtrQAAAAAIgDlZwAAStGlYAQAAQAAAAAAAwAAAAAAAgAAAAAABAAAAAAA');
  const [channel, setChannel] = useState('DOCOSAN_VIDEO_0987334567');


  const [playVideo, setPlayVideo] = useState(true);
  const [playAudio, setPlayAudio] = useState(true);

  const {
    localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers, resumedByKey
  } = useAgora(client);

  function ShowBtnVideo() {
    if (playVideo) {
      return <button
        type='button'
        className='btn btn-primary btn-sm'
        onClick={() => {
          setPlayVideo(!playVideo);
          resumedByKey({ play: false, key: "video" });
        }}
      >
        Stop Video
      </button>
    }
    return <button
      type='button'
      className='btn btn-primary btn-sm'
      onClick={() => {
        setPlayVideo(!playVideo);
        resumedByKey({ play: true, key: "video" });
      }}
    >
      Resumed Video
    </button>
  }

  function ShowBtnAudio() {
    if (playAudio) {
      return <button
        type='button'
        className='btn btn-primary btn-sm'
        onClick={() => {
          setPlayAudio(!playAudio);
          resumedByKey({ play: false, key: "audio" });
        }}
      >
        Stop Audio
      </button>
    }
    return <button
      type='button'
      className='btn btn-primary btn-sm'
      onClick={() => {
        setPlayAudio(!playAudio);
        resumedByKey({ play: true, key: "audio" });
      }}
    >
      Resumed Audio
    </button>
  }

  return (
    <div className='call'>
      <form className='call-form'>
        <label>
          AppID:
          <input
            value={appid}
            type='text'
            name='appid' onChange={(event) => { setAppid(event.target.value) }} />
        </label>
        <label>
          Token(Optional):
          <input
            value={token}

            type='text' name='token' onChange={(event) => { setToken(event.target.value) }} />
        </label>
        <label>
          Channel:
          <input
            value={channel}
            type='text' name='channel' onChange={(event) => { setChannel(event.target.value) }} />
        </label>
        <div className='button-group'>
          <button
            id='join'
            type='button'
            className='btn btn-primary btn-sm'
            disabled={joinState}
            onClick={() => { join(appid, channel, token) }}
          >
            Join
             </button>
          <button
            id='leave'
            type='button'
            className='btn btn-primary btn-sm'
            disabled={!joinState}
            onClick={() => { leave() }}
          >
            Leave
             </button>
          {ShowBtnVideo()}
          {ShowBtnAudio()}

        </div>
      </form>

      <div className='player-container'>
        <div className='local-player-wrapper'>
          {/* <p className='local-player-text'>
            {localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}
          </p> */}
          <MediaPlayer
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
          />
        </div>
        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
          {/* <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p> */}
          <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
        </div>))}
      </div>
    </div>
  );
}
export default Call;
