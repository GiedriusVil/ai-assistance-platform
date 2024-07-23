/*
	© Copyright IBM Corporation 2024. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const SCHEMA = Joi.alternatives().try(
    Joi.object({}),
    Joi.boolean()
);

export {
    SCHEMA,
};
