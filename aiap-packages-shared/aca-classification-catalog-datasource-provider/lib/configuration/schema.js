/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const CLASSIFICATION_CATALOG_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    collections: {
        catalogs: Joi.string().required(),
        catalogReleases: Joi.string().required(),
        segments: Joi.string().required(),
        families: Joi.string().required(),
        classes: Joi.string().required(),
        subClasses: Joi.string().required(),
        vectors: Joi.string().required(),
        actions: Joi.string().required(),
    }
});

const CLASSIFICATION_CATALOG_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(CLASSIFICATION_CATALOG_DATASOURCE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
    CLASSIFICATION_CATALOG_DATASOURCE_PROVIDER_SCHEMA
};
