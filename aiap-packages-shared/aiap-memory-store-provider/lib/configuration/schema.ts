/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const MEMORY_STORE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  expiration: Joi.number().required(),
  keyPrefix: Joi.string(),
  client: Joi.string().required(),
});

export const SCHEMA = Joi.alternatives().try(
  Joi.object({
    stores: Joi.array().items(MEMORY_STORE_SCHEMA)
  }),
  Joi.boolean(),
)
