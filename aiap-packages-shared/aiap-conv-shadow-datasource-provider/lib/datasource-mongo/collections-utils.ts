/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-conv-shadow-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IShadowDatasourceConfigurationConversationsV1,
  IShadowDatasourceConversationsCollectionsV1,
} from '../types';

const DEFAULT_COLLECTIONS = {
  conversations: 'shadow_conversations',
  utterances: 'shadow_utterances',
  messages: 'shadow_messages',
};

const sanitizedCollectionsFromConfiguration = (
  configuration: IShadowDatasourceConfigurationConversationsV1,
): IShadowDatasourceConversationsCollectionsV1 => {
  try {
    const COLLECTIONS_CONFIGURATION = configuration.collections;

    const CONVERSATIONS = COLLECTIONS_CONFIGURATION.conversations;
    const UTTERANCES = COLLECTIONS_CONFIGURATION.utterances;
    const MESSAGES = COLLECTIONS_CONFIGURATION.messages;

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
      !lodash.isEmpty(MESSAGES)
    ) {
      RET_VAL.messages = MESSAGES;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sanitizedCollectionsFromConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  sanitizedCollectionsFromConfiguration,
}
