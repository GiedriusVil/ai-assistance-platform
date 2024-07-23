/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const VALIDATION_ENGAGEMENTS_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    validationEngagements: Joi.string().required(),
    validationEngagementsChanges: Joi.string().required(),
  },
});

const VALIDATION_ENGAGEMENTS_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(VALIDATION_ENGAGEMENTS_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

module.exports = {
  VALIDATION_ENGAGEMENTS_DATASOURCE_PROVIDER_SCHEMA,
};
