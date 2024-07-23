/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const TEST_CASES_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(),
    collections: {
        testCaseConfigurations: Joi.string().required(),
        testCases: Joi.string().required(),
        testCaseExecutions: Joi.string().required(),
    }
});

const TEST_CASES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(TEST_CASES_DATASOURCE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
    TEST_CASES_DATASOURCE_PROVIDER_SCHEMA
};
