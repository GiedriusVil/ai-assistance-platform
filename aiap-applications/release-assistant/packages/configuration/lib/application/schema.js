/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const APP_SCHEMA = Joi.object({
  releaseVersion: Joi.string().required(),
  client: Joi.string().required(),
  clientTarget: Joi.string().required(),
  bulkSize: Joi.number(),
  tenantId: Joi.string().required(),
  assistantId: Joi.string().required(),
  collections: {
    conversations: Joi.string(),
    utterances: Joi.string(),
    messages: Joi.string(),
    entities: Joi.string(),
    intents: Joi.string(),
    feedbacks: Joi.string(),
    surveys: Joi.string(),
    tones: Joi.string(),
    environments: Joi.string(),
    users: Joi.string(),
    aiServices: Joi.string(),
    aiSkills: Joi.string(),
    docValidationAudits: Joi.string(),
    rules: Joi.string(),
    organizations: Joi.string(),
  }
});

module.exports = {
  APP_SCHEMA
};
