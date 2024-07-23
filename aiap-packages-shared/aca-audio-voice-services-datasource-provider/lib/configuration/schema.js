/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const AUDIO_VOICE_SERVICES_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(),
    collections: {
        audioVoiceServices: Joi.string().required(),

    }
});

const AUDIO_VOICE_SERVICES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        sources: Joi.array().items(AUDIO_VOICE_SERVICES_DATASOURCE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
  AUDIO_VOICE_SERVICES_DATASOURCE_PROVIDER_SCHEMA
};
