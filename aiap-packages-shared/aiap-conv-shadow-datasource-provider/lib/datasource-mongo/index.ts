/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-conversations-shadow-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  createIndex,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  BaseDatasourceMongoV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IShadowDatasourceConversationsV1,
  IShadowDatasourceConfigurationConversationsV1,
  //
  IShadowDatasourceConversationsCollectionsV1,
  // 
  IConversationShadowSaveOneParamsV1,
  IUtteranceShadowSaveOneParamsV1,
  IMessageShadowSaveOneParamsV1,
} from '../types';

import {
  sanitizedCollectionsFromConfiguration
} from './collections-utils';

import * as _conversations from './conversations';
import * as _utterances from './utterances';
import * as _messages from './messages';

class ConversationsShadowDatasourceMongoV1 extends BaseDatasourceMongoV1<IShadowDatasourceConfigurationConversationsV1> implements IShadowDatasourceConversationsV1 {

  _collections: IShadowDatasourceConversationsCollectionsV1;

  constructor(
    configuration: IShadowDatasourceConfigurationConversationsV1,
  ) {
    super(configuration);
    try {
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      await createIndex(DB, COLLECTIONS.conversations, { id: 1 });
      await createIndex(DB, COLLECTIONS.messages, { id: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { id: 1 });

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get conversations() {
    const RET_VAL = {
      saveOne: async (
        context: IContextV1,
        params: IConversationShadowSaveOneParamsV1
      ) => {
        return _conversations.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get utterances() {
    const RET_VAL = {
      saveOne: async (
        context: IContextV1,
        params: IUtteranceShadowSaveOneParamsV1,
      ) => {
        return _utterances.saveOne(this, context, params);
      },
    }
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = {
      saveOne: async (
        context: IContextV1,
        params: IMessageShadowSaveOneParamsV1,
      ) => {
        return _messages.saveOne(this, context, params);
      },
    }
    return RET_VAL;
  }
}

export {
  ConversationsShadowDatasourceMongoV1,
}
