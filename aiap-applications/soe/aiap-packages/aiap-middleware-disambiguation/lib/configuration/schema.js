/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    minConfidence: Joi.number().required(),
    maxConfidence: Joi.number().required(),
    maxDifference: Joi.number().required(),
    selectIntentMessage: Joi.string().required(),
    intents: Joi.object(),
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
};
