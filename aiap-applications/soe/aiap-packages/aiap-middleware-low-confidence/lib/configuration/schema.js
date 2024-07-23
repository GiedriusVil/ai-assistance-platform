/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    minConfidence: Joi.string().required(),
    maxRetryCount: Joi.number().default(1),
    retryMessage: Joi.string().required(),
    message: Joi.string().required(),
    skill: Joi.string().required(),
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
};
