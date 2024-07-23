/*
 * Licensed Materials - Property of IBM Asset Number Pending
 * (c) Copyright IBM Corp.  2020 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp. Spatial & Metaverse Team
 */
const MODULE_ID = `hark-config`;

import { EventEmitter } from 'events';

// var WildEmitter = require('wildemitter');

function getMaxVolume(analyser: any, fftBins: any) {
  var maxVolume = -Infinity;
  analyser.getFloatFrequencyData(fftBins);
  for (var i = 4, ii = fftBins.length; i < ii; i++) {
    if (fftBins[i] > maxVolume && fftBins[i] < 0) {
      maxVolume = fftBins[i];
    }
  };
  return maxVolume;
}


var audioContextType: any;
if (
  typeof window !== 'undefined'
) {
  // audioContextType = window.AudioContext || window.webkitAudioContext;
  audioContextType = window.AudioContext;
}
// use a single audio context due to hardware limits
var audioContext: any = null;
export function hark(stream: any, options: any) {
  var harker: any = new EventEmitter();

  // make it not break in non-supported browsers
  if (!audioContextType) return harker;

  //Config
  var options = options || {},
    smoothing = (options.smoothing || 0.1),
    interval = (options.interval || 50),
    threshold = options.threshold,
    play = options.play,
    history = options.history || 10,
    running = true;

  //Setup Audio Context
  if (!audioContext) {
    audioContext = new audioContextType();
  }
  var sourceNode: any;
  var fftBins: any;
  var analyser: any;

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = smoothing;
  fftBins = new Float32Array(analyser.frequencyBinCount);

  if (stream.jquery) stream = stream[0];

  if (
    stream instanceof HTMLAudioElement ||
    stream instanceof HTMLVideoElement
  ) {
    //Audio Tag
    sourceNode = audioContext.createMediaElementSource(stream);
    if (typeof play === 'undefined') play = true;
    threshold = threshold || -60;
  } else {
    //WebRTC Stream
    sourceNode = audioContext.createMediaStreamSource(stream);
    threshold = threshold || -60;
  }

  sourceNode.connect(analyser);
  if (play) analyser.connect(audioContext.destination);

  harker.speaking = false;

  harker.suspend = function () {
    audioContext.suspend();
  }
  harker.resume = function () {
    audioContext.resume();
  }
  Object.defineProperty(harker, 'state', {
    get: function () {
      return audioContext.state;
    }
  });
  audioContext.onstatechange = function () {
    harker.emit('state_change', audioContext.state);
  }

  harker.setThreshold = function (t: any) {
    threshold = t;
  };

  harker.setInterval = function (i: any) {
    interval = i;
  };

  harker.stop = function () {
    running = false;
    harker.emit('volume_change', -100, threshold);
    if (harker.speaking) {
      harker.speaking = false;
      harker.emit('stopped_speaking');
    }
    analyser.disconnect();
    sourceNode.disconnect();
  };
  harker.speakingHistory = [];
  for (var i = 0; i < history; i++) {
    harker.speakingHistory.push(0);
  }

  // Poll the analyser node to determine if speaking
  // and emit events if changed
  var looper = function () {
    setTimeout(function () {

      //check if stop has been called
      if (!running) {
        return;
      }

      var currentVolume = getMaxVolume(analyser, fftBins);

      harker.emit('volume_change', currentVolume, threshold);

      var history = 0;
      if (currentVolume > threshold && !harker.speaking) {
        // trigger quickly, short history
        for (var i = harker.speakingHistory.length - 3; i < harker.speakingHistory.length; i++) {
          history += harker.speakingHistory[i];
        }
        if (history >= 2) {
          harker.speaking = true;
          harker.emit('speaking');
        }
      } else if (currentVolume < threshold && harker.speaking) {
        for (var i = 0; i < harker.speakingHistory.length; i++) {
          history += harker.speakingHistory[i];
        }
        if (history == 0) {
          harker.speaking = false;
          harker.emit('stopped_speaking');
        }
      }
      harker.speakingHistory.shift();
      if (
        currentVolume > threshold
      ) {
        harker.speakingHistory.push(1);
      } else {
        harker.speakingHistory.push(0);
      }
      looper();
    }, interval);
  };
  looper();
  return harker;
}
