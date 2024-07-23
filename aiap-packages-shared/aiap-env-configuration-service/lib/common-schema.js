/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.object({
  instanceId: Joi.alternatives()
    .try(Joi.number(), Joi.string())
    .required(),
});

module.exports = {
  SCHEMA,
}
