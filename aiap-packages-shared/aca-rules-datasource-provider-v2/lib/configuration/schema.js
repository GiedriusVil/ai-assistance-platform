/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const RULES_DATASOURCE_V2_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    rulesV2: Joi.string().required(),
    rulesConditionsV2: Joi.string().required(),
    rulesChangesV2: Joi.string().required(),
  },
});

const RULES_DATASOURCE_PROVIDER_V2_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(RULES_DATASOURCE_V2_SCHEMA)
  }),
  Joi.boolean()
);

module.exports = {
  RULES_DATASOURCE_PROVIDER_V2_SCHEMA,
};
