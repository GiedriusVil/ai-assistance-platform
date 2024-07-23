/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SCHEMA_HANDLER = Joi.object({
  name: Joi.string().required(),
  method: Joi.string().required(),
});

export const SCHEMA = Joi.alternatives().try(
  Joi.object({
    handlers: Joi.array().items(SCHEMA_HANDLER),
  }),
  Joi.boolean()
)
