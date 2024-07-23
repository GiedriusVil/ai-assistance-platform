/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversation-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { AcaConversationsDatasource } = require('../datasource');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _ai = require('./ai-services');
const _conversations = require('./conversations');
const _transcripts = require('./transcripts');
const _utterances = require('./utterances');
const _messages = require('./messages');
const _surveys = require('./surveys');
const _feedbacks = require('./feedbacks');
const _users = require('./users');
const _intents = require('./intents');
const _entities = require('./entities');

class AcaConversationsDatasourceMongo extends AcaConversationsDatasource {

  constructor(configuration) {
    super(configuration);
    try {

      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
      const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async _getClient() {
    const RET_VAL = await this.acaMongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.acaMongoClient.getDB();
    return RET_VAL;
  }

  async _getAcaMongoClient() {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
        const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);
        this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
        retVal = this.acaMongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve AcaMongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getAcaMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      await createIndex(DB, COLLECTIONS.conversations, { start: 1 });
      await createIndex(DB, COLLECTIONS.conversations, { end: 1 });
      await createIndex(DB, COLLECTIONS.conversations, { assistantId: 1 });

      await createIndex(DB, COLLECTIONS.entities, { utteranceId: 1 });
      await createIndex(DB, COLLECTIONS.entities, { sequence: 1 });
      await createIndex(DB, COLLECTIONS.entities, { assistantId: 1 });

      await createIndex(DB, COLLECTIONS.feedbacks, { utteranceId: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { messageId: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { score: 1 });

      await createIndex(DB, COLLECTIONS.intents, { utteranceId: 1 });
      await createIndex(DB, COLLECTIONS.intents, { assistantId: 1 });

      await createIndex(DB, COLLECTIONS.messages, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.messages, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.messages, { created: 1 });
      await createIndex(DB, COLLECTIONS.messages, { 'attachment.type': 'text' });

      await createIndex(DB, COLLECTIONS.surveys, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.surveys, { assistantId: 1 });

      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
      });

      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.entities': 1,
        'aiServiceResponse.external.result.entities.entity': 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.entities.entity': 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.intents.intent': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.intents': 1,
        'aiServiceResponse.external.result.intents.intent': 1,
      });

      // TODO Lower index cannot be create - limitation of MongoDb!
      // await createIndex(DB, COLLECTIONS.utterances, {
      //   timestamp: 1,
      //   assistantId: 1,
      //   'aiServiceResponse.external.result.entities': 1,
      //   'aiServiceResponse.external.result.entities.entity': 1,
      //   'aiServiceResponse.external.result.intents': 1,
      //   'aiServiceResponse.external.result.intents.intent': 1,
      // });


      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        'response.text': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'context.private.user.id': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'response.text': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'context.private.user.id': 1,
        'response.text': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { topIntentScore: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'response.text': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'context.private.user.id': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'context.private.userProfile.userId': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { source: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { dialogNodes: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'source': 'text', 'response.text': 'text' });

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error('_ensureIndexes', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  get conversations() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _conversations.findManyByQuery(this, context, params);
      },
      retrieveIdsByQuery: async (context, params) => {
        return _conversations.retrieveIdsByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _conversations.findOneById(this, context, params);
      },
      addReview: async (context, params) => {
        return _conversations.addReview(this, context, params);
      },
      saveTags: async (context, params) => {
        return _conversations.saveTags(this, context, params);
      },
      removeReview: async (context, params) => {
        return _conversations.removeReview(this, context, params);
      },
      deleteOneByConversationId: async (context, params) => {
        return _conversations.deleteOneByConversationId(this, context, params);
      },
      deleteManyByQuery: async (context, params) => {
        return _conversations.deleteManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _conversations.deleteManyByIds(this, context, params);
      },
      saveOne: async (context, params) => {
        return _conversations.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _conversations.saveMany(this, context, params);
      },
      findManyByUserId: async (context, params) => {
        return _conversations.findManyByUserId(this, context, params);
      },
      removeTags: async (context, params) => {
        return _conversations.removeTags(this, context, params);
      },
      channels: async (context, params) => {
        return _conversations.channels(this, context, params);
      }
    };
    return RET_VAL;
  }

  get users() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _users.saveOne(this, context, params);
      },
      findOneById: async (context, params) => {
        return _users.findOneById(this, context, params);
      },
      findManyByQueryV2: async (context, params) => {
        return _users.findManyByQueryV2(this, context, params);
      },
      maskMany: async (context, params) => {
        return _users.maskMany(this, context, params);
      },
      saveMany: async (context, params) => {
        return _users.saveMany(this, context, params);
      },
    };
    return RET_VAL;
  }

  get intents() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _intents.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _intents.saveMany(this, context, params);
      }
    };
    return RET_VAL;
  }

  get entities() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _entities.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _entities.saveMany(this, context, params);
      }
    };
    return RET_VAL;
  }

  get utterances() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _utterances.findManyByQuery(this, context, params);
      },
      findManyByConversationsIds: async (context, params) => {
        return _utterances.findManyByConversationsIds(this, context, params);
      },
      findOneById: async (context, params) => {
        return _utterances.findOneById(this, context, params);
      },
      findTopIntentsByQuery: async (context, params) => {
        return _utterances.findTopIntentsByQuery(this, context, params);
      },
      findLatest5ByQuery: async (context, params) => {
        return _utterances.findLatest5ByQuery(this, context, params);
      },
      retrieveTotals: async (context, params) => {
        return _utterances.retrieveTotals(this, context, params);
      },
      updateOneById: async (context, params) => {
        return _utterances.updateOneById(this, context, params);
      },
      updateManyByParams: async (context, params) => {
        return _utterances.updateManyByParams(this, context, params);
      },
      saveOne: async (context, params) => {
        return _utterances.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _utterances.saveMany(this, context, params);
      },
      findManyByQueryV2: async (context, params) => {
        return _utterances.findManyByQueryV2(this, context, params);
      },
      maskMany: async (context, params) => {
        return _utterances.maskMany(this, context, params);
      },
      findManyByAiChangeRequestIds: async (context, params) => {
        return _utterances.findManyByAiChangeRequestIds(this, context, params);
      },
    }
    return RET_VAL;
  }

  get transcripts() {
    const RET_VAL = {
      findOneByConversationId: async (context, params) => {
        return _transcripts.findOneByConversationId(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _transcripts.findManyByQuery(this, context, params);
      },
      maskOne: async (context, params) => {
        return _transcripts.maskOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _messages.findManyByQuery(this, context, params);
      },
      updateOneById: async (context, params) => {
        return _messages.updateOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _messages.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _messages.saveMany(this, context, params);
      },
    }
    return RET_VAL;
  }

  get surveys() {
    const RET_VAL = {
      findAvgScoreByQuery: async (context, params) => {
        return _surveys.findAvgScoreByQuery(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _surveys.findManyByQuery(this, context, params);
      },
      saveOne: async (context, params) => {
        return _surveys.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _surveys.saveMany(this, context, params);
      },
    };
    return RET_VAL
  }

  get feedbacks() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _feedbacks.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _feedbacks.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _feedbacks.saveOne(this, context, params);
      },
      saveMany: async (context, params) => {
        return _feedbacks.saveMany(this, context, params);
      },
      deleteOneByMessageId: async (context, params) => {
        return _feedbacks.deleteOneByMessageId(this, context, params);
      },
    };
    return RET_VAL
  }



  // I need more clarity on this one!!!
  get ai() {
    return {
      findServices: async (context, params) => {
        return _ai.findServices(this, context, params);
      },
    };
  }

}

module.exports = {
  AcaConversationsDatasourceMongo
};
