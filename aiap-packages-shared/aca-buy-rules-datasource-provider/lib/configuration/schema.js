/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const BUY_RULES_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    collections: {
        buyRules: Joi.string().required(),
        buyRulesActions: Joi.string().required(),
        buyRulesConditions: Joi.string().required(),
        buyRulesSuppliers: Joi.string().required(),
    },
    defaultbuyRulesEnabled: Joi.boolean().required(),
});

const BUY_RULES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(BUY_RULES_DATASOURCE_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    BUY_RULES_DATASOURCE_PROVIDER_SCHEMA,
};
