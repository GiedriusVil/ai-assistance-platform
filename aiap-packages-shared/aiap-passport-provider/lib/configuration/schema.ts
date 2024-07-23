/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const PASSPORT_STRATEGY_SCHEMA = Joi.object({
  name: Joi.string().required(),
});

export const SCHEMA = Joi.alternatives().try(
  Joi.object({
    strategies: Joi.array().items(PASSPORT_STRATEGY_SCHEMA)
  }),
  Joi.boolean()
);
