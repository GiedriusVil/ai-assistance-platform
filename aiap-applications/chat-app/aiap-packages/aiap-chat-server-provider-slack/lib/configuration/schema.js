/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SLACK_SERVER_SCHEMA = Joi.object({
    tenant: {
        id: Joi.string().required(),
    },
    assistant: {
        id: Joi.string().required(),
    },
    engagement: {
        id: Joi.string().required(),
    },
    external: {
        botUserAccessToken: Joi.string().required(),
        botSigningSecret: Joi.string().required(),
        appId: Joi.string().required(),
    }
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        servers: Joi.array().items(SLACK_SERVER_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    SCHEMA,
}; 
