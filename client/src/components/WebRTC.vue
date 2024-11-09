<template>
  <div>
    <video ref="localVideo" autoplay></video>
    <video ref="remoteVideo" autoplay></video>
    <button @click="startCall">Start Call</button>
  </div>
</template>

<script>
export default {
  methods: {
    async startCall() {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.$refs.localVideo.srcObject = localStream;

      const pc = new RTCPeerConnection();

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
        this.$refs.remoteVideo.srcObject = event.streams[0];
      };

      // WebRTC signaling logic should go here
    },
  },
};
</script>
