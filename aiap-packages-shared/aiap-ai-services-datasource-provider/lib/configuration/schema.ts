/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const AI_SERVICES_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  encryptionKey: Joi.string().required(),
  collections: {
    aiServices: Joi.string().required(),
    aiServicesChanges: Joi.string().required(),
    aiServicesChangeRequest: Joi.string().required(),
    aiSkillReleases: Joi.string().required(),
    aiServiceTests: Joi.string().required()
  }
})

export const SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(AI_SERVICES_DATASOURCE_SCHEMA)
  }),
  Joi.boolean(),
)
