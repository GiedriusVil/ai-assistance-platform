/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const carousel = require('./carousel');
const socketioButtons = require('./socketio-buttons/socketio-buttons');
const image = require('./image');
const video = require('./video');
const iot = require('./iot');

module.exports = {
  carousel,
  image,
  socketioButtons,
  video,
  ...iot,
};
