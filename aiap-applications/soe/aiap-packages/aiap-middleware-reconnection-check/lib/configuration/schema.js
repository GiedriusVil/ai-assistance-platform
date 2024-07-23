/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    notification: Joi.boolean().default(true),
    message: Joi.string(),
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
};
