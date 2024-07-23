/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const DATA_MASKING_SCHEMA = Joi.object({
  key: Joi.string().required(),
  pattern: Joi.string().required(),
  replaceType: Joi.string().required(),
  patternType: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    defaultPatterns: Joi.array().items(DATA_MASKING_SCHEMA),
    disabledMaskingByTenant: Joi.array(),
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
}
