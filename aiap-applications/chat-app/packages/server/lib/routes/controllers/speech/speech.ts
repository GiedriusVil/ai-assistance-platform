/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app-server-routes-controllers-speech-speech';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  AuthorizationV1,
  TextToSpeechV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import { getConfiguration } from '@ibm-aiap/aiap-chat-app-configuration';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const config = getConfiguration();

const getToken = async (req, res) => {
  if (
    config.voiceServices
  ) {
    const sttAuthService = new AuthorizationV1({
      iam_apikey: config.voiceServices.stt.iamApiKey,
      url: config.voiceServices.stt.uri,
    });

    sttAuthService.getToken((error, token) => {
      if (error) {
        res.status(200).json({ error: error.message });
      } else {
        res.status(200).json({ token: token });
      }
    });
  } else {
    res.status(200).json({ error: 'IBM Cloud IAM token missing.' });
  }
};

const getAudio = async (req, res) => {
  try {
    const TEXT_2_SPEECH_SERVICE = new TextToSpeechV1({
      iam_apikey: config.voiceServices.tts.iamApiKey,
      url: config.voiceServices.tts.uri,
      headers: {
        'X-Watson-Learning-Opt-Out': 'true',
      },
    });

    const PARAMS = {
      text: req.body.text,
      accept: req.body.format,
      voice: req.body.voice,
    };
    const BODY: Array<any> = [];
    const RESPONSE = await TEXT_2_SPEECH_SERVICE.synthesize(PARAMS);

    RESPONSE.result.on('data', (chunk) => {
      BODY.push(chunk);
    });
    RESPONSE.result.on('end', (chunk) => {
      const RESULT = Buffer.concat(BODY).toString('base64');
      res.status(200).send({ result: RESULT });
    });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAudio.name, { ACA_ERROR });
    res.status(500).json({ error: ACA_ERROR });
  }
};

export default {
  getToken,
  getAudio,
};
