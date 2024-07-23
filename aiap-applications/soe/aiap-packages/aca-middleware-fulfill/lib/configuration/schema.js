/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const FULFILL_SCHEMA = Joi.alternatives().try(
    Joi.object({}),
    Joi.boolean()
);

module.exports = {
    FULFILL_SCHEMA,
};
