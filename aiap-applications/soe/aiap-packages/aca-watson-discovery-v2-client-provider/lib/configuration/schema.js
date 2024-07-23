/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const WA_DISCOVERY_V2_CONNECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
    defaultEndpoint: Joi.boolean().default(false),
    username: Joi.string().when('authorizationType', { is: 'default', then: Joi.string().required() }),
    password: Joi.string().when('authorizationType', { is: 'default', then: Joi.string().required() }),
    serviceUrl: Joi.string().required(),
    versionDate: Joi.string().required(),
    projectId: Joi.string().required(),
    collectionName: Joi.string().required(),
    authorizationType: Joi.string().default('default'),
    iamApiKey: Joi.string().when('authorizationType', { is: 'iam', then: Joi.string().required() }),
    iamUrl: Joi.string(),
});

const WA_DISCOVERY_V2_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        maxRetries: Joi.string().required(),
        backoffDelay: Joi.string().required(),
        unavailableMessage: Joi.string().required(),
        resultsLimit: Joi.string().required(),
        services: Joi.array().items(WA_DISCOVERY_V2_CONNECTION_SCHEMA),
        poller: {
            interval: Joi.string().required(),
          },
    }),
    Joi.boolean()
);

module.exports = {
    WA_DISCOVERY_V2_PROVIDER_SCHEMA
};
