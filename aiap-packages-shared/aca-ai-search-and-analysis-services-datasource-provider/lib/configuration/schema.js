/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('@ibm-aca/aca-wrapper-joi');

const AI_SEARCH_AND_ANALYSIS_SERVICES_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  encryptionKey: Joi.string().required(),
  collections: {
    aiSearchAndAnalysisServices: Joi.string().required(),
    aiSearchAndAnalysisProjects: Joi.string().required(),
    aiSearchAndAnalysisCollections: Joi.string().required(),
  }
});

const AI_SEARCH_AND_ANALYSIS_SERVICES_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(AI_SEARCH_AND_ANALYSIS_SERVICES_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

module.exports = {
  AI_SEARCH_AND_ANALYSIS_SERVICES_DATASOURCE_PROVIDER_SCHEMA,
};
