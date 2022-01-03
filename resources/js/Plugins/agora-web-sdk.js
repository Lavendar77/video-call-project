import AgoraRTC from "agora-rtc-sdk-ng";

let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null
};

async function startBasicCall(appId, token, channel, uid) {
    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes a video track.
        if (mediaType === "video") {
            // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
            const remoteVideoTrack = user.videoTrack;
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            const remotePlayerContainer = document.getElementById("remote-player");

            // Play the remote video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack.play(remotePlayerContainer);
        }

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            const remotePlayerContainer = document.getElementById(user.uid);
            // Destroy the container.
            remotePlayerContainer.remove();
        });

    });

    // Join an RTC channel.
    await rtc.client.join(appId, channel, token, uid);
    // Create a local audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Publish the local audio and video tracks to the RTC channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    // Dynamically create a container in the form of a DIV element for playing the local video track.
    const localPlayerContainer = document.getElementById("local-player");

    // Play the local video track.
    // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
    rtc.localVideoTrack.play(localPlayerContainer);
    console.log("publish success!");
}

async function endCall(userId = null) {
    // Destroy the local audio and video tracks.
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();

    if (userId) {
        // Remove the user
        rtc.client.remoteUsers.filter(user => user.uid === userId).forEach(user => {
            // Destroy the dynamically created DIV containers.
            const playerContainer = document.getElementById(user.uid);
            playerContainer && playerContainer.remove();
        });
    } else {
        // Traverse all remote users.
        rtc.client.remoteUsers.forEach(user => {
            // Destroy the dynamically created DIV containers.
            const playerContainer = document.getElementById(user.uid);
            playerContainer && playerContainer.remove();
        });
    }

    // Leave the channel.
    await rtc.client.leave();
}

export { startBasicCall, endCall };
