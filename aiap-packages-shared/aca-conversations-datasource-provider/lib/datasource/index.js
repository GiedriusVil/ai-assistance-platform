/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const EventEmitter = require('events');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const surveys = require('../datasource-mongo/surveys');

class AcaConversationsDatasource extends EventEmitter {

  constructor(configuration) {
    super();
    this.configuration = configuration;
    this.id = ramda.path(['id'], this.configuration);
    this.name = ramda.path(['name'], this.configuration);
    this.hash = ramda.path(['hash'], this.configuration);
    this.type = ramda.path(['type'], this.configuration);
  }

  get conversations() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      deleteOneByConversationId: async (context, params) => { },
      deleteManyByQuery: async (context, params) => { },
      findManyByUserId: async (context, params) => { },
    };
    return RET_VAL;
  }

  get users() {
    const RET_VAL = {
      saveOne: async (context, params) => { }
    };
    return RET_VAL;
  }

  get utterances() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      findTopIntentsByQuery: async (context, params) => { },
      retrieveTotals: async (context, params) => { },
      updateOneById: async (context, params) => { },
      updateManyByParams: async (context, params) => { },
      saveOne: async (context, params) => { },
      saveMany: async (context, params) => { },
    }
    return RET_VAL;
  }

  get transcripts() {
    const RET_VAL = {
      findOneByConversationId: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      maskOne: async (context, params) => { },
    };
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = {
      updateOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      saveMany: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
    }
    return RET_VAL;
  }

  get surveys() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      saveOne: async (context, params) => { },
      saveMany: async (context, params) => { },
    };
    return RET_VAL;
  }

  get feedbacks() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      saveMany: async (context, params) => { },
    };
    return RET_VAL;
  }

  get reports() {
    const RET_VAL = {
      metrics: { findAll: () => { } },
      watson: {
        findAllIntents: () => { },
        findAllEntities: () => { }
      },
      conversations: { findAll: () => { } },
      transfers: { findAll: () => { } },
      surveys: { findAll: () => { } },
      channels: { findAll: () => { } },
      workspaces: { findAll: () => { } },
    };
    return RET_VAL;
  }

  get export() {
    const RET_VAL = {
      conversations: {
        findAll: () => { }
      },
      surveys: {
        findAll: params => {
          return surveys.findAll(this.models, this.config, params);
        },
      },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaConversationsDatasource
};
