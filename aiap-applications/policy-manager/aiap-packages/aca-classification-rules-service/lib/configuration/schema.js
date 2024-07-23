/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const CLASSIFICATION_RULES_SERVICE_SCHEMA = Joi.alternatives().try(
    Joi.object({}),
    Joi.boolean()
);

module.exports = {
    CLASSIFICATION_RULES_SERVICE_SCHEMA
};
