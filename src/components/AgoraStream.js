import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import Loading from './loading/Loading';
import './styles/agoraStyles.scss';
import Select from 'react-select'
import _ from 'lodash';

AgoraStream.propTypes = {

};

const audioInputName = "audioInputName";
const audioOutputName = "audioOutputName";
const videoSelectName = "videoSelectName";

function AgoraStream(props) {

    const [rtc, setRtc] = useState({});
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(true);

    const [audioInputSelectOption, setAudioInputSelectOption] = useState([]);
    const [audioOutputSelectOption, setAudioOutputSelectOption] = useState([]);
    const [videoSelectOption, setVideoSelectOption] = useState([]);

    const [audioInputValue, setAudioInputValue] = useState({});
    const [audioOutputValue, setAudioOutputValue] = useState({});
    const [videoValue, setVideoValue] = useState({});

    const videoElementRef = useRef(null);
    const audioInputSelectRef = useRef(null);
    const audioOutputSelectRef = useRef(null);
    const videoSelectRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setRtc(
                {
                    ...rtc,
                    client: AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
                }
            );
            setOptions({
                ...options,
                appId: "2d265eac4ca3480688a95fa45278a645",
                channel: "DOCOSAN_VIDEO_0987334567",
                uid: "101184",
                token: "0062d265eac4ca3480688a95fa45278a645IADNq0jTxUNax/DXa3AW3OW0uRNzQ1WsyAGt6y6sBp3af7LdtrQAAAAAIgAEZAAAGH+kYAQAAQAAAAAAAwAAAAAAAgAAAAAABAAAAAAA"
            });
            attachDevices();
            setLoading(false);
        }, 300);
    }, []);


    useEffect(() => {
        rtc.client.on("user-published", async (user, mediaType) => {
            // Subscribe to a remote user.
            await rtc.client.subscribe(user, mediaType);

            // If the subscribed track is video.
            if (mediaType === "video") {
                // Get `RemoteVideoTrack` in the `user` object.
                const remoteVideoTrack = user.videoTrack;
                // Dynamically create a container in the form of a DIV element for playing the remote video track.
                const playerContainer = document.createElement("div");
                // Specify the ID of the DIV container. You can use the `uid` of the remote user.
                playerContainer.id = user.uid.toString();
                playerContainer.style.width = "640px";
                playerContainer.style.height = "480px";
                document.body.append(playerContainer);

                // Play the remote video track.
                // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
                remoteVideoTrack.play(playerContainer);

                // Or just pass the ID of the DIV container.
                // remoteVideoTrack.play(playerContainer.id);
            }

            // If the subscribed track is audio.
            if (mediaType === "audio") {
                // Get `RemoteAudioTrack` in the `user` object.
                const remoteAudioTrack = user.audioTrack;
                // Play the audio track. No need to pass any DOM element.
                remoteAudioTrack.play();
            }
        });
    }, [rtc])

    const onHandleJoin = async () => {
        //create uid
        const uid = options && await rtc.client.join(options.appId, options.channel, options.token, options.uid);
        // Create an audio track from the audio sampled by a microphone.
        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // Create a video track from the video captured by a camera.
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        // Publish the local audio and video tracks to the channel.
        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

        start({ audioParams: audioInputValue, videoParams: videoValue })

        console.log("publish success!");
    };

    const attachDevices = () => {
        try {
            navigator.mediaDevices.enumerateDevices()
                .then(getDevicesOption)
        } catch (error) {
            console.log("🚀 ~ file: AgoraStream.js ~ line 57 ~ openCamera ~ error", error)
        }
    }

    const getDevicesOption = (deviceInfos) => {
        const audioInputSelectOption = [];
        const audioOutputSelectOption = [];
        const videoSelectOption = [];

        _.map(deviceInfos, (item, index) => {
            const itemChild = {
                value: item.deviceId,
                label: item.label
            };

            switch (item.kind) {
                case 'audioinput':
                    audioInputSelectOption.push(itemChild);
                    break;
                case 'audiooutput':
                    audioOutputSelectOption.push(itemChild);
                    break;
                case 'videoinput':
                    videoSelectOption.push(itemChild);
                    break;
                default:
                    break;
            }
        });

        setAudioInputSelectOption(audioInputSelectOption);
        setAudioOutputSelectOption(audioOutputSelectOption);
        setVideoSelectOption(videoSelectOption);

        setAudioInputValue(_.head(audioInputSelectOption));
        setAudioOutputValue(_.head(audioOutputSelectOption));
        setVideoValue(_.head(videoSelectOption));
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoElementRef.current.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }

    function start({ audioParams, videoParams }) {
        try {
            if (window.stream) {
                window.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            const constraints = {
                audio: {
                    deviceId: audioParams ? { exact: audioParams.value } : undefined
                },
                video: {
                    deviceId: videoParams ? { exact: videoParams.value } : undefined
                }
            };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(gotStream);

        } catch (error) {
            console.log("🚀 ~ file: AgoraStream.js ~ line 114 ~ start ~ error", error)
        }
    }

    const onChangeSelect = ({ keyChange, valueChange }) => {
        switch (keyChange) {
            case audioInputName:
                setAudioInputValue(findItemByKey({ options: audioInputSelectOption, keyItem: valueChange }));
                start({ audioParams: valueChange, videoParams: videoValue });
                break;
            case audioOutputName:
                setAudioOutputValue(findItemByKey({ options: audioInputSelectOption, keyItem: valueChange }));
                break;
            case videoSelectName:
                setVideoValue(findItemByKey({ options: videoSelectOption, keyItem: valueChange.value }));
                start({ audioParams: audioInputValue, videoParams: valueChange });
                break;
            default:
                break;
        }
    }

    const findItemByKey = ({ options, keyItem }) => {
        return _.find(options, (item) => {
            return item.value === keyItem
        })
    }

    if (loading)
        return <Loading />;

    return <div className="container">
        <div className="devices-box">
            {/* <div className="devices">
                <label>Audio input source</label>
                <Select
                    options={audioInputSelectOption}
                    value={audioInputValue}
                    onChange={(value) => onChangeSelect({ keyChange: audioInputName, valueChange: value })}
                    ref={audioInputSelectRef}
                />
            </div>
            <div className="devices">
                <label>Audio output destination</label>
                <Select
                    options={audioOutputSelectOption}
                    value={audioOutputValue}
                    onChange={(value) => onChangeSelect({ keyChange: videoSelectName, valueChange: value })}
                    ref={audioOutputSelectRef}
                />
            </div> */}
            <div className="devices">
                <label>Video source</label>
                <Select
                    options={videoSelectOption}
                    value={videoValue}
                    onChange={(value) => onChangeSelect({ keyChange: videoSelectName, valueChange: value })}
                    ref={videoSelectRef}
                />
            </div>
        </div>

        <video
            ref={videoElementRef}
            id="video"
            playsInline
            autoPlay
        />
        <button onClick={onHandleJoin}>
            Join
        </button>
    </div>;
}



export default AgoraStream;