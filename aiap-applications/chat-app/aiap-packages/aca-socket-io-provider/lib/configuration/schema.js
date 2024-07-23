/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SOCKET_IO_SCHEMA = Joi.object({
    name: Joi.string().required(),  
    type: Joi.string().required(),
    emitter: Joi.string().required(),
    receiver: Joi.string().required(),
});

const SOCKET_IO_PROVIDER_SCHEMA = Joi.alternatives().try(
    Joi.object({
        SOCKET_IO_PROVIDERS: Joi.array().items(SOCKET_IO_SCHEMA)
    }),
    Joi.boolean(),
);

module.exports = {
    SOCKET_IO_PROVIDER_SCHEMA
};
