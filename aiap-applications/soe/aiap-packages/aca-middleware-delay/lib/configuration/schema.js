/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const SCHEMA = Joi.alternatives().try(Joi.object({
    responseFirstDelay: Joi.number(),
    responseSubsequentDelay: Joi.number(),
}), Joi.boolean());

module.exports = {
    SCHEMA
};
