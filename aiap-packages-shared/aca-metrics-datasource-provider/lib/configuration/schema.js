/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(),
    collections: {
        purchaseRequests: Joi.string().required(),
        docValidations: Joi.string().required(),
    },
});

const PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(DATASOURCE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
    PROVIDER_SCHEMA,
};
