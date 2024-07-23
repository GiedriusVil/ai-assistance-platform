/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');


const DEFAULT_JOB_OPTIONS_SCHEMA = Joi.alternatives().try(
    Joi.object({
        removeOnComplete: Joi.number().optional(),
        repeat: {
            every: Joi.number().optional(),      
            limit: Joi.number().optional(),
            cron: Joi.string().optional(),
        }
    }),
    Joi.boolean() 
);

const JOBS_QUEUE_SCHEMA = Joi.object({
    tenantId: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(), 
    defaultJob: {
        lambdaModule: Joi.string().required(),
        options: DEFAULT_JOB_OPTIONS_SCHEMA,
    }
});

const SCHEMA = Joi.alternatives().try(
    Joi.object({
        queues: Joi.array().items(JOBS_QUEUE_SCHEMA)
    }),
    Joi.boolean()
);

module.exports = {
    SCHEMA,
};
