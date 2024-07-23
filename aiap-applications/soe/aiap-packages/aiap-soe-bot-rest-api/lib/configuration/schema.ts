/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA_SETTINGS = Joi.alternatives().try(
  Joi.object({
    id: Joi.string().required(),
  }),
  Joi.boolean()
);


const SCHEMA = Joi.alternatives().try(Joi.object({
  settings: SCHEMA_SETTINGS,
}), Joi.boolean());

export {
  SCHEMA,
}
