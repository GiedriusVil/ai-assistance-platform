/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Joi from '@ibm-aca/aca-wrapper-joi';

const AI_TRANSLATION_SERVICES_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  encryptionKey: Joi.string().required(),
  collections: {
    aiTranslationsServices: Joi.string().required(),
    aiTranslationsServicesChanges: Joi.string().required(),
    aiTranslationModels: Joi.string().required(),
    aiTranslationModelsChanges: Joi.string().required(),
    aiTranslationModelExamples: Joi.string().required(),
    aiTranslationModelPrompts: Joi.string().required(),
  }
});

const SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(AI_TRANSLATION_SERVICES_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

export {
  SCHEMA,
};
