/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    modules: Joi.string().required(),
    modulesReleases: Joi.string().required(),
    modulesConfigurations: Joi.string().required(),
  },
});

const PROVIDER_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(DATASOURCE_SCHEMA),
  }),
  Joi.boolean()
);

export { 
  PROVIDER_SCHEMA 
};
