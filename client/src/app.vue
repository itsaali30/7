<template>
  <div id="app">
    <h1>Project 15: Vite, WebRTC, and Airtable API</h1>
    <div>
      <video ref="localVideo" autoplay muted></video>
      <video ref="remoteVideo" autoplay></video>
    </div>
    <button @click="startCall">Start Call</button>
    <button @click="fetchData">Fetch Airtable Data</button>

    <div v-if="airtableData">
      <h2>Airtable Data:</h2>
      <ul>
        <li v-for="record in airtableData" :key="record.id">
          {{ record.fields.Name }} - {{ record.fields.Description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      airtableData: null,
    };
  },
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

      // WebRTC signaling logic should go here for establishing a connection.
    },
    async fetchData() {
      try {
        const response = await axios.get("/api/data");
        this.airtableData = response.data.records;
      } catch (error) {
        console.error("Failed to fetch Airtable data:", error);
      }
    },
  },
};
</script>

<style>
#app {
  text-align: center;
}

video {
  width: 300px;
  margin: 10px;
  border: 2px solid black;
}
</style>
