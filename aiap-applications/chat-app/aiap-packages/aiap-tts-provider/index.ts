/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AIAPTTSHttpProvider,
  AIAPTTSIbmCloudProvider
} from './lib';

const REGISTRY = {
  TTS_HTTP: new AIAPTTSHttpProvider(),
  TTS_IBM_CLOUD: new AIAPTTSIbmCloudProvider()
};

const getTTSRegistry = () => {
  return REGISTRY;
}

export {
  getTTSRegistry,
};
