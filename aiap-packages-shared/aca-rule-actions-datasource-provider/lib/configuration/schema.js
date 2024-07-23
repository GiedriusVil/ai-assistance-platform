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
        actions: Joi.string().required(),
    },
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(DATASOURCE_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    SCHEMA,
};
