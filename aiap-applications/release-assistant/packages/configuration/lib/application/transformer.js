/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformAppConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    releaseVersion: rawConfiguration.RELEASE_ASSISTANT_RELEASE_VERSION,
    client: rawConfiguration.RELEASE_ASSISTANT_MONGO_CLIENT,
    clientTarget: rawConfiguration.RELEASE_ASSISTANT_MONGO_CLIENT_TARGET,
    bulkSize: rawConfiguration.RELEASE_ASSISTANT_BULK_SIZE || 50000,
    assistantId: rawConfiguration.RELEASE_ASSISTANT_ASSISTANT_ID,
    tenantId: rawConfiguration.RELEASE_ASSISTANT_TENANT_ID,
    collections: {
      conversations: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_CONVERSATIONS || 'conversations',
      utterances: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_UTTERANCES || 'utterances',
      messages: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_MESSAGES || 'messages',
      entities: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_ENTITIES || 'entities',
      intents: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_INTENTS || 'intents',
      feedbacks: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_FEEDBACKS || 'feedbacks',
      surveys: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_SURVEYS || 'surveys',
      tones: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_TONES || 'tones',
      environments: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_ENVIRONMENTS || 'environments',
      users: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_USERS || 'users',
      aiServices: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_AI_SERVICES || 'aiServices',
      aiSkills: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_AI_SKILLS || 'aiSkills',
      docValidationAudits: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_DOC_VALIDATION_AUDITS || 'docValidationAudits',
      rules: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_RULES || 'rules',
      organizations: rawConfiguration.RELEASE_ASSISTANT_COLLECTION_ORGANIZATIONS || 'organizations',
    },
  };
  return RET_VAL;
}

module.exports = {
  transformAppConfiguration
};
