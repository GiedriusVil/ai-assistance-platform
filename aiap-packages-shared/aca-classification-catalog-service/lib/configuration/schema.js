/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const DEFAULT_SERVICE_SCHEMA = Joi.alternatives().try(
  Joi.object({
    configurationLocalSyncEnabled: Joi.boolean(),
  }),
  Joi.boolean()
);

module.exports = {
  DEFAULT_SERVICE_SCHEMA,
};
