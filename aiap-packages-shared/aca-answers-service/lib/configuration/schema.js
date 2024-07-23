/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.alternatives().try(
  Joi.object({

    // Need to revalidate - if following configuration is still required
    configurationLocalSyncEnabled: Joi.boolean(),
    environment: Joi.object({
      lower: Joi.string().required(),
      current: Joi.string().required()
    }).optional(),
  }),
  Joi.boolean()
);

module.exports = {
  SCHEMA,
};
