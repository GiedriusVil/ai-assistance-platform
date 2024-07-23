/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const CLASSIFIER_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    models: Joi.string().required(),
    modelsChanges: Joi.string().required(),
  },
});

const CLASSIFIER_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(CLASSIFIER_DATASOURCE_SCHEMA),
  }),
  Joi.boolean()
);

module.exports = {
  CLASSIFIER_DATASOURCE_PROVIDER_SCHEMA,
};
