/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const RULES_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    collections: {
        rules: Joi.string().required(),
        rulesReleases: Joi.string().required(),
        rulesMessages: Joi.string().required(),
        messagesReleases: Joi.string().required(),
    },
    defaultRulesEnabled: Joi.boolean().default(false),
    defaultMessagesEnabled: Joi.boolean().default(false)
});

const RULES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(RULES_DATASOURCE_SCHEMA),
        rulesImportCollectionPrefix: Joi.string(),
        rulesMessagesImportCollectionPrefix: Joi.string(),
    }),
    Joi.boolean()
);

module.exports = {
    RULES_DATASOURCE_PROVIDER_SCHEMA
};
