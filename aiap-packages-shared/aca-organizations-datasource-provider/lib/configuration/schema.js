/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const ORGANIZATIONS_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    collections: {
        organizations: Joi.string().required(),
        organizationsReleases: Joi.string().required(),
    },
    defaultOrganizationsEnabled: Joi.boolean().required(),
});

const ORGANIZATIONS_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(ORGANIZATIONS_DATASOURCE_SCHEMA),
        organizationsImportCollectionPrefix: Joi.string(),
    }),
    Joi.boolean()
);

module.exports = {
    ORGANIZATIONS_DATASOURCE_PROVIDER_SCHEMA,
};
