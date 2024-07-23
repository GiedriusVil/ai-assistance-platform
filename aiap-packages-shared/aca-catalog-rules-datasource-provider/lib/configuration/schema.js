/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const CATALOG_RULES_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    collections: {
        catalogRules: Joi.string().required(),
        catalogRulesConditions: Joi.string().required(),
        catalogRulesCatalogs: Joi.string().required(),
    },
    defaultcatalogRulesEnabled: Joi.boolean().required(),
});

const CATALOG_RULES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(CATALOG_RULES_DATASOURCE_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    CATALOG_RULES_DATASOURCE_PROVIDER_SCHEMA,
};
