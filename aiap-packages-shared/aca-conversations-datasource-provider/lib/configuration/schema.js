/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const CONVERSATIONS_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    conversations: Joi.string().required(),
    utterances: Joi.string().required(),
    messages: Joi.string().required(),
    entities: Joi.string().required(),
    intents: Joi.string().required(),
    feedbacks: Joi.string().required(),
    surveys: Joi.string().required(),
    tones: Joi.string().required(),
    environments: Joi.string().required(),
    users: Joi.string().required(),
  }
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(CONVERSATIONS_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
};
