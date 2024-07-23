/*
    © Copyright IBM Corporation 2022. All Rights Reserved 
     
    SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const ENGAGEMENTS_DATASOURCE_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    client: Joi.string().required(),
    collections: {
        engagements: Joi.string().required(),
        engagementsChanges: Joi.string().required(),
    }
});

export const ENGAGEMENTS_DATASOURCE_PROVIDER_SCHEMA =
    Joi.alternatives().try(
        Joi.object({
            sources: Joi.array().items(ENGAGEMENTS_DATASOURCE_SCHEMA)
        }),
        Joi.boolean()
    );
