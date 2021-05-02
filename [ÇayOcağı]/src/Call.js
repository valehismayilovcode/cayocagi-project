import options from "./CallOptions";
import "./agora-sdk";
import * as AgoraRTC from "./agora-sdk";

console.log(window.AgoraRTC);
// create Agora client

class Call {
  uid = null;

  remoteUsers = {};

  localTracks = {
    videoTrack: null,
    audioTrack: null
  };

  constructor() {
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }

  async join() {
    // add event listener to play remote tracks when remote user publishs.
    this.client.on("user-published", this.handleUserPublished);
    this.client.on("user-unpublished", this.handleUserUnpublished);

    // join a channel and create local tracks, we can use Promise.all to run them concurrently
    [
      this.uid,
      this.localTracks.audioTrack,
      this.localTracks.videoTrack
    ] = await Promise.all([
      // join the channel
      this.client.join(options.appid, options.channel, options.token || null),
      // create local tracks, using microphone and camera
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack()
    ]);
    debugger;

    // play local video track
    this.localTracks.videoTrack.play("local-player");

    // publish local tracks to channel
    await this.client.publish(Object.values(this.localTracks));
    console.log("publish success");
  }

  async leave() {
    for (const trackName in this.localTracks) {
      var track = this.localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        this.localTracks[trackName] = undefined;
      }
    }

    // remove remote users and player views
    this.remoteUsers = {};

    // leave the channel
    await this.client.leave();
    console.log("client leaves channel success");
  }

  async subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await this.client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === "video") {
      user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  }

  handleUserPublished(user, mediaType) {
    const id = user.uid;
    this.remoteUsers[id] = user;
    this.subscribe(user, mediaType);
  }

  handleUserUnpublished(user) {
    const id = user.uid;
    delete this.remoteUsers[id];
  }
}

export default Call;
