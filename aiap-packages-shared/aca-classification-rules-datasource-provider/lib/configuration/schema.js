/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const CLASSIFICATION_RULES_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    collections: {
        classificationRules: Joi.string().required(),
        classificationRulesConditions: Joi.string().required(),
        classificationRulesClassifications: Joi.string().required(),
    },
    defaultclassificationRulesEnabled: Joi.boolean().required(),
});

const CLASSIFICATION_RULES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(CLASSIFICATION_RULES_DATASOURCE_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    CLASSIFICATION_RULES_DATASOURCE_PROVIDER_SCHEMA,
};
