/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversation-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  conversations: 'conversations',
  utterances: 'conversationsUtterances',
  intents: 'conversationsIntents',
  entities: 'conversationsEntities',
  messages: 'conversationsMessages',
  feedbacks: 'conversationsFeedbacks',
  surveys: 'conversationsSurveys',
  users: 'conversationsUsers',
};

const sanitizedCollectionsFromConfiguration = (
  configuration
) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const CONVERSATIONS = COLLECTIONS_CONFIGURATION?.conversations;
  const UTTERANCES = COLLECTIONS_CONFIGURATION?.utterances;

  const INTENTS = COLLECTIONS_CONFIGURATION?.intents;
  const ENTITIES = COLLECTIONS_CONFIGURATION?.entities;
  const MESSAGES = COLLECTIONS_CONFIGURATION?.messages;
  const FEEDBACKS = COLLECTIONS_CONFIGURATION?.feedbacks;
  const SURVEYS = COLLECTIONS_CONFIGURATION?.surveys;
  const USERS = COLLECTIONS_CONFIGURATION?.users;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(CONVERSATIONS)
  ) {
    RET_VAL.conversations = CONVERSATIONS;
  }
  if (
    !lodash.isEmpty(UTTERANCES)
  ) {
    RET_VAL.utterances = UTTERANCES;
  }
  if (
    !lodash.isEmpty(INTENTS)
  ) {
    RET_VAL.intents = INTENTS;
  }
  if (
    !lodash.isEmpty(ENTITIES)
  ) {
    RET_VAL.entities = ENTITIES;
  }
  if (
    !lodash.isEmpty(MESSAGES)
  ) {
    RET_VAL.messages = MESSAGES;
  }
  if (
    !lodash.isEmpty(FEEDBACKS)
  ) {
    RET_VAL.feedbacks = FEEDBACKS;
  }
  if (
    !lodash.isEmpty(SURVEYS)
  ) {
    RET_VAL.surveys = SURVEYS;
  }
  if (
    !lodash.isEmpty(USERS)
  ) {
    RET_VAL.users = USERS;
  }
  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
