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
            let remoteVideoTrack = user.videoTrack;

            // Get the player container
            let playerContainer = document.getElementsByClassName("players")[0];

            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            let remotePlayerContainer = document.createElement("div");
            remotePlayerContainer.id = user.uid;
            remotePlayerContainer.innerHTML = `<div class="flex flex-col justify-center items-center">User ${uid}</div>`;
            remotePlayerContainer.className = 'player rounded overflow-hidden shadow-lg';
            playerContainer.append(remotePlayerContainer);

            // Play the remote video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack.play(remotePlayerContainer);
        }

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            let remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            let remotePlayerContainer = document.getElementById(user.uid);
            // Destroy the container.
            remotePlayerContainer && remotePlayerContainer.remove();
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

    // Get the player container
    let playerContainer = document.getElementsByClassName("players")[0];

    // Dynamically create a container in the form of a DIV element for playing the local video track.
    let localPlayerContainer = document.createElement("div");
    localPlayerContainer.id = uid;
    localPlayerContainer.innerHTML = `<div class="flex flex-col justify-center items-center">User ${uid}</div>`;
    localPlayerContainer.className = 'player rounded overflow-hidden shadow-lg';
    playerContainer.append(localPlayerContainer);

    // Play the local video track.
    // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
    rtc.localVideoTrack.play(localPlayerContainer);
    console.log("publish success!");
}

async function endCall() {
    // Destroy the local audio and video tracks.
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();

    // Traverse all remote users.
    rtc.client.remoteUsers.forEach(user => {
        // Destroy the dynamically created DIV containers.
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
}

export { startBasicCall, endCall };
