/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');


const SCHEMA = Joi.alternatives().try(
  Joi.object({
    type: Joi.string().default('cache'),
    expiration: Joi.number().default(7200),
  })
);


module.exports = {
  SCHEMA,
};
