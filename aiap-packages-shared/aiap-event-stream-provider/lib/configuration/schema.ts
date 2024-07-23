/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const EVENT_STREAM_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  scope: Joi.string().required(),
  clientEmitter: Joi.string().required(),
  clientReceiver: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    streams: Joi.array().items(EVENT_STREAM_SCHEMA)
  }),
  Joi.boolean(),
);

export {
  SCHEMA,
}
