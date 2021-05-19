import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AgoraRTC, { IAgoraRTCClient, ClientConfig } from "agora-rtc-sdk-ng";
import Loading from './loading/Loading';
import './styles/basicVideoStyles.scss'
import FormSubmit from './FormSubmit';
import { useAppContext } from '../context/AppContext';

import _ from 'lodash';

BasicVideoCall.propTypes = {

};



export const config = {
    mode: "rtc", codec: "vp8",
};

function BasicVideoCall(props) {
    const { client, setClient } = useAppContext();

    const [options, setOptions] = useState({});
    // const [client, setClient] = useState({});
    const [loading, setLoading] = useState(true);
    const [remoteUsers, setRemoteUsers] = useState({});
    const [dataScreen, setDataScreen] = useState([]);

    const formRef = useRef();

    let localTracks = {
        videoTrack: null,
        audioTrack: null
    };

    useEffect(() => {
        setTimeout(() => {
            let clientInit = _.cloneDeep(client);
            clientInit.on("user-published", handleUserPublished);
            clientInit.on("user-unpublished", handleUserUnpublished);

            setClient(clientInit);
            setOptions({
                ...options,
                appId: "2d265eac4ca3480688a95fa45278a645",
                channel: "DOCOSAN_VIDEO_0987334567",
                uid: "101184",
                token: "0062d265eac4ca3480688a95fa45278a645IADNq0jTxUNax/DXa3AW3OW0uRNzQ1WsyAGt6y6sBp3af7LdtrQAAAAAIgAEZAAAGH+kYAQAAQAAAAAAAwAAAAAAAgAAAAAABAAAAAAA"
            });
            setLoading(false);
        }, 300);

    }, []);


    function handleUserPublished(user, mediaType) {
        const id = user.uid;

        setRemoteUsers({
            ...remoteUsers,
            id: user
        })
        remoteUsers[id] = user;
        subscribe(user, mediaType);
    }

    function handleUserUnpublished(user) {
        const id = user.uid;
        delete remoteUsers[id];
        // $(`#player-wrapper-${id}`).remove();
    }

    async function subscribe(user, mediaType) {
        try {
            const uid = user.uid;

            const client2 = AgoraRTC.createClient(config)
            // subscribe to a remote user
            console.log("🚀 ~ file: BasicVideoCall.js ~ line 77 ~ subscribe ~ client", client)

            client && await client.subscribe(user, mediaType);
            console.log("subscribe success");
            debugger
            if (mediaType === 'video') {
                console.log("!23");
                // const player = $(`
                //     <div id="player-wrapper-${uid}">
                //     <p class="player-name">remoteUser(${uid})</p>
                //     <div id="player-${uid}" class="player"></div>
                //     </div>
                // `);
                // $("#remote-playerlist").append(player);
                user.videoTrack.play(`player-${uid}`);
            }
            if (mediaType === 'audio') {
                user.audioTrack.play();
            }
        } catch (error) {
            console.log("🚀 ~ file: BasicVideoCall.js ~ line 74 ~ subscribe ~ error", error)

        }
    }


    const onHandleJoin = async () => {

        const valueForm = formRef.current.getAllData();

        // join a channel and create local tracks, we can use Promise.all to run them concurrently
        [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
            // join the channel
            client.join(valueForm.appId, valueForm.channel, valueForm.token || null),
            // create local tracks, using microphone and camera
            AgoraRTC.createMicrophoneAudioTrack(),
            AgoraRTC.createCameraVideoTrack()
        ]);

        // play local video track
        localTracks.videoTrack.play("local-player");
        // $("#local-player-name").text(`localVideo(${options.uid})`);

        // publish local tracks to channel
        await client.publish(Object.values(localTracks));
        console.log("publish success");
    }

    const renderVideoScreen = () => {

    }

    if (loading)
        return <Loading />;

    return <>

        <FormSubmit
            ref={formRef}
        />

        <div className="row video-group">
            <div className="col">
                <p id="local-player-name" className="player-name"></p>
                <div id="local-player" className="player"></div>
            </div>
            <div className="w-100"></div>
            <div className="col">
                <div id="remote-playerlist">
                    {renderVideoScreen()}
                </div>
            </div>
        </div>
        <button
            id="join"
            onClick={onHandleJoin}
            className="btn btn-primary btn-sm"
        >
            Join
          </button>
    </>;
}

export default BasicVideoCall;