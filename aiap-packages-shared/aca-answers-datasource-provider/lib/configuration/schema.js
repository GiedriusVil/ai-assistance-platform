/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const ANSWERS_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(),
    collections: {
        answers: Joi.string().required(), // DEPRECATED
        answersReleases: Joi.string().required(), // DEPRECATED
        answerStores: Joi.string().required(),
        answerStoreReleases: Joi.string().required(),
    }
});

const ANSWERS_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(ANSWERS_DATASOURCE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
    ANSWERS_DATASOURCE_PROVIDER_SCHEMA
};
