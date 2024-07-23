/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const POLICY_ENGINE_CLIENT_SCHEMA = Joi.object({
    hostname: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        client: POLICY_ENGINE_CLIENT_SCHEMA
    }),
    Joi.boolean(),
);

module.exports = {
    SCHEMA,
};
