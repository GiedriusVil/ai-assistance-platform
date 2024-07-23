/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const CONV_SHADOW_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    conversations: Joi.string().required(),
    utterances: Joi.string().required(),
    messages: Joi.string().required(),
  }
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(CONV_SHADOW_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

export {
  SCHEMA,
};
