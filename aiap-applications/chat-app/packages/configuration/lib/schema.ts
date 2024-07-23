/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as Joi from '@ibm-aca/aca-wrapper-joi';

import {
  attachEternalLibsSchemas
} from './external-configurations';

import {
  AcaHostPageInfoConfigurator
} from './host-page-info';

const genesys = Joi.alternatives().try(Joi.object({
  channelId: Joi.string(),
  uri: Joi.string(),
  organizationId: Joi.string(),
  deploymentId: Joi.string(),
  queue: Joi.string(),
}), Joi.boolean());

const voiceServices = Joi.alternatives().try(Joi.object({
  stt: {
    uri: Joi.string(),
    iamApiKey: Joi.string(),
    wss: Joi.string(),
  },
  tts: {
    uri: Joi.string(),
    iamApiKey: Joi.string(),
  },
}), Joi.boolean());

let schema = Joi.object({
  channel: {
    genesys: genesys,
  },
  app: {
    port: Joi.number(),
    conversationIdSecret: Joi.string(),
    sessionDeleteTimeout: Joi.number(),
    continuousChatEnabled: Joi.boolean(),
  },
  widget: {
    chatAppHost: Joi.string(),
    title: Joi.string(),
    audio: Joi.boolean(),
    inputHistory: Joi.boolean(),
    prechat: Joi.boolean(),
    expand: Joi.boolean(),
    draggable: Joi.boolean(),
    resizer: Joi.boolean(),
  },
  jwt: {
    required: Joi.boolean(),
    pem: Joi.string(),
  },
  downloadTranscript: Joi.boolean(),
  surveyEnabled: Joi.boolean(),
  testUrlEnabled: Joi.boolean(),
  errorDetailsEnabled: Joi.boolean(),
  voiceServices: voiceServices,
  logger: {
    debug: Joi.string(),
    maskingEnabled: Joi.boolean(),
    enablePrettifier: Joi.boolean(),
  },
}).append(AcaHostPageInfoConfigurator.schema());

schema = attachEternalLibsSchemas(schema);

export = schema;
