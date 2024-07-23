/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controllers-config';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  getConfiguration
} from '@ibm-aiap/aiap-chat-app-configuration';

const getConfig = (req, res) => {
  const config = getConfiguration();
  let parameters = {
    io: config.ioClient,
    ioServer: config.ioServer,
    audioEnabled: config.widget.audio,
    inputHistoryEnabled: config.widget.inputHistory,
    title: config.widget.title,
    prechatEnabled: config.widget.prechat,
    expandWidget: config.widget.expand,
    sessionExpiration: config.app.sessionDeleteTimeout,
    continuousChatEnabled: config.app.continuousChatEnabled,
    jwtRequired: config.jwt.required,
    downloadTranscript: config.downloadTranscript,
    surveyEnabled: config.surveyEnabled,
    channel: config.channel,
    acaChatServer: config.acaChatServer,
    hostPageInfo: config.hostPageInfo,
    draggableEnabled: config.widget.draggable,
    resizerEnabled: config.widget.resizer,
    errorDetailsEnabled: config.errorDetailsEnabled,
  };
  if (config.voiceServices) {
    parameters = ramda.mergeAll([
      parameters,
      {
        voiceServices: {
          stt: {
            wss: config.voiceServices.stt.wss,
          },
        },
      },
    ]);
  }
  return res.status(200).json(parameters);
};

const getFullConfig = (req, res) => {
  const CONFIGURATION = getConfiguration();
  return res.status(200).json(CONFIGURATION);
}

export default {
  getConfig,
  getFullConfig,
};
