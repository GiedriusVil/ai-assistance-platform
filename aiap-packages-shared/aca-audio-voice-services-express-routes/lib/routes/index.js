/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = express.Router();

const audioVoiceServicesRoutes = require('./audio-voice-services');

routes.use(
  '/',
  allowIfHasPagesPermissions('AudioVoiceServicesViewV1'),
  audioVoiceServicesRoutes
);

module.exports = routes;
