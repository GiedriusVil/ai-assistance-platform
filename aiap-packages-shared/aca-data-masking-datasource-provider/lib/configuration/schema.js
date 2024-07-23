/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const DATA_MASKING_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    dataMaskingConfigurations: Joi.string().required(),
  },
});

const DATA_MASKING_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(DATA_MASKING_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

module.exports = {
  DATA_MASKING_DATASOURCE_PROVIDER_SCHEMA,
};
