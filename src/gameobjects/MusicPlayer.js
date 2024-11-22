import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';

class MusicPlayer {
  constructor(scene, midiFilePath) {
    this.scene = scene;
    this.midiFilePath = midiFilePath;
    this.audioContext = null; // Delay AudioContext creation
    this.synth = null; // Delay synth creation
    this.volume = null; // Delay volume control creation
  }

  async initializeAudio() {
    // Initialize AudioContext, Volume, and Synth only after user interaction
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.volume = new Tone.Volume(0).toDestination(); // Initialize Volume
      this.synth = new Tone.PolySynth(Tone.Synth).connect(this.volume); // Connect the synth to the volume control
    }
  }

  async loadAndPlayMusic() {
    await this.initializeAudio(); // Ensure AudioContext, Volume, and Synth are created

    try {
      // Fetch and parse the MIDI file
      const response = await fetch(this.midiFilePath);
      const midiArrayBuffer = await response.arrayBuffer();
      const midi = new Midi(midiArrayBuffer);

      // Schedule each note to play with Tone.js
      midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
          this.synth.triggerAttackRelease(note.name, note.duration, note.time);
        });
      });

      // Start the Tone.js transport
      Tone.Transport.start();
    } catch (error) {
      console.error("Error loading or playing MIDI file:", error);
    }
  }

  async setVolume(level) {
    await this.initializeAudio(); // Ensure AudioContext and Volume are initialized
    if (this.volume) {
      // Set volume level using Tone.js volume control
      this.volume.volume.setValueAtTime(level, Tone.now());
    } else {
      console.error("Volume control is not initialized.");
    }
  }
}

export default MusicPlayer;
