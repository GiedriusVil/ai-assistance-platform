/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { AiSearchAndAnalysisServiceAdapter } = require('../adapter');

const _projects = require('./projects');
const _collections = require('./collections');
const _documents = require('./documents');
 
class AiSearchAndAnalysisServiceAdapterWatsonDiscoveryV2 extends AiSearchAndAnalysisServiceAdapter {

  constructor() {
    super();
  }

  get projects() {
    return {
      findMany: async (context, params) => { 
        return _projects.findMany(context, params);
      },
      createOne: async (context, params) => {
        return _projects.createOne(context, params);
      },
      deleteOne: async (context, params) => {
        return _projects.deleteOne(context, params);
      },
    };
  }

  get collections() {
    return {
      findMany: async (context, params) => { 
        return _collections.findMany(context, params);
      },
      findOne: async (context, params) => {
        return _collections.findOne(context, params);
      },
      createOne: async (context, params) => {
        return _collections.createOne(context, params);
      },
      deleteOne: async (context, params) => {
        return _collections.deleteOne(context, params);
      },
      queryMany: async (context, params) => {
        return _collections.queryMany(context, params);
      }
    };
  }

  get documents() {
    return {
      findMany: async (context, params) => {
        return _documents.findMany(context, params);
      },
      deleteOne: async (context, params) => {
        return _documents.deleteOne(context, params);
      }
    };
  }
}

module.exports = {
  AiSearchAndAnalysisServiceAdapterWatsonDiscoveryV2,
};
