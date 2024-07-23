/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  AiSearchAndAnalysisServiceAdapterWatsonDiscoveryV2,
} = require('./lib/adapter-watson-discovery-v2');

const REGISTRY = {
  WDS: new AiSearchAndAnalysisServiceAdapterWatsonDiscoveryV2(),
};

const getRegistry = () => {
  return REGISTRY;
}

module.exports = {
  getRegistry,
};
