/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const DATA_ITEM_REQ_SCHEMA = Joi.object({
    sourceKey: Joi.string().required(), 
    targetKey: Joi.string().required(), 
    type: Joi.string().required(),
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        dataItemReqs: Joi.array().items(DATA_ITEM_REQ_SCHEMA),
    }), 
    Joi.boolean(),
);

export {
    SCHEMA,
}
