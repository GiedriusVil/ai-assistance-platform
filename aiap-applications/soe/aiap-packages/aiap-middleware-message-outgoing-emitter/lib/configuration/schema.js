/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    withHandover: Joi.boolean().default(false),
    fallbackMessage: Joi.string().required(),
    handoverSkill: Joi.alternatives().when('withHandover', {
      is: true,
      then: Joi.any().required(),
      otherwise: Joi.any(),
    }),
    handoverMessage: Joi.alternatives().when('withHandover', {
      is: true,
      then: Joi.any().required(),
      otherwise: Joi.any(),
    }),
  }),
  Joi.boolean().falsy()
);

module.exports = {
  SCHEMA,
};
