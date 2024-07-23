/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AIAPSTTHttpProvider,
  AIAPSTTIbmCloudProvider
} from './lib';

const REGISTRY = {
  STT_HTTP: new AIAPSTTHttpProvider(),
  STT_IBM_CLOUD: new AIAPSTTIbmCloudProvider()
};

const getSTTRegistry = () => {
  return REGISTRY;
}

export {
  getSTTRegistry,
};
