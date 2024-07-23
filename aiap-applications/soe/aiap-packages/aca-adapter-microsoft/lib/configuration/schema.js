/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const MICROSOFT_CREDENTIALS_SCHEMA = Joi.object({
    botName: Joi.string().required(),
    appId: Joi.string().required(),
    appPassword: Joi.string().required(),
});

const G_ACA_PROPS_SCHEMA = Joi.object({
    botName: Joi.string().required(),
    appId: Joi.string().required(),
    tenant: Joi.string().required(),
    tenantId: Joi.string().required(),
    assistantId: Joi.string().required(),
    engagementId: Joi.string().required(),
    displayName: Joi.string().required(),
    isoLang: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        credentials: Joi.array().items(MICROSOFT_CREDENTIALS_SCHEMA),
        gAcaProps: Joi.array().items(G_ACA_PROPS_SCHEMA),
    }),
    Joi.boolean()
);

module.exports = {
    SCHEMA
};
