/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

class AiSearchAndAnalysisServiceAdapter {

  constructor() { }

  get projects() {
    return {
      findMany: async (context, params) => { 
        throw new Error('Not implemented');
      },
      findOne: async (context, params) => {
        throw new Error('Not implemented');
      },
      createOne: async (context, params) => {
        throw new Error('Not implemented');
      },
      deleteOne: async (context, params) => {
        throw new Error('Not implemented');
      },
      updateOne: async (context, params) => {
        throw new Error('Not implemented');
      }
    };
  }
}

module.exports = {
  AiSearchAndAnalysisServiceAdapter,
};
