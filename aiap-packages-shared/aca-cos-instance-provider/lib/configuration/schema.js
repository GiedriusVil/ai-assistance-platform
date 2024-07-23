/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const INSTANCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    options: {
        id: Joi.string().required(),
        region: Joi.string().required(),
        apiKey: Joi.string().required(),
        endpoint: Joi.string().required(),
    }
});

const PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        instances: Joi.array().items(INSTANCE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
    PROVIDER_SCHEMA,
};
