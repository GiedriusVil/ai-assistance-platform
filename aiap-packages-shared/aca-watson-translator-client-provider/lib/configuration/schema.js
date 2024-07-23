/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const WA_TRANSLATOR_CONNECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
    defaultEndpoint: Joi.boolean().default(false),
    authorizationType: Joi.string().default('default'),
    serviceUrl: Joi.string().required(),
    versionDate: Joi.string().required(),
    iamApiKey: Joi.string().when('authorizationType', { is: 'iam', then: Joi.string().required() }),
});

const WA_TRANSLATOR_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        services: Joi.array().items(WA_TRANSLATOR_CONNECTION_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    WA_TRANSLATOR_PROVIDER_SCHEMA
};
