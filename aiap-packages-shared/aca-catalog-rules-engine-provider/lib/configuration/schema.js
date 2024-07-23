/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const JSON_RULE_ENGINE_SHCEMA = Joi.object({
    allowUndefinedFacts: Joi.boolean().required(),
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        jsonRuleEngine: JSON_RULE_ENGINE_SHCEMA
    }),
    Joi.boolean(),
);

module.exports = {
    SCHEMA,
};
