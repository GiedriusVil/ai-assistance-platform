/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const ERROR_SCHEMA = Joi.object({
  defaultMessage: Joi.string().default('Sorry, I am not able to answer.'),
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    error: ERROR_SCHEMA,
  }),
  Joi.boolean()
);

export {
  SCHEMA,
}
