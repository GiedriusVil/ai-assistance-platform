/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
// const auth = require('ibm-watson/auth');
// const {
//   BasicAuthenticator,
//   IamAuthenticator,
// } = require('ibm-watson/auth');

// const AssistantV1 = require('ibm-watson/assistant/v1');
// const AssistantV2 = require('ibm-watson/assistant/v2');

// const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

// const AuthorizationV1 = require('ibm-watson/authorization/v1');
// const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
// const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

// const DiscoveryV1 = require('ibm-watson/discovery/v1');
// const DiscoveryV2 = require('ibm-watson/discovery/v2');

// const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');


import * as auth from 'ibm-watson/auth';
import {
  BasicAuthenticator,
  IamAuthenticator,
} from 'ibm-watson/auth';

import AssistantV1 from 'ibm-watson/assistant/v1';
import AssistantV2 from 'ibm-watson/assistant/v2';

import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';

import AuthorizationV1 from 'ibm-watson/authorization/v1';
import TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';

import DiscoveryV1 from 'ibm-watson/discovery/v1';
import DiscoveryV2 from 'ibm-watson/discovery/v2';

import LanguageTranslatorV3 from 'ibm-watson/language-translator/v3';

const ibmWatson = {
  AssistantV1,
  AssistantV2,
  auth,
  AuthorizationV1,
  DiscoveryV1,
  DiscoveryV2,
  LanguageTranslatorV3,
  NaturalLanguageUnderstandingV1,
}

export {
  ibmWatson,
  BasicAuthenticator,
  IamAuthenticator,
  AuthorizationV1,
  TextToSpeechV1,
  AssistantV1,
  AssistantV2,
  LanguageTranslatorV3,
  DiscoveryV1,
  DiscoveryV2,
  SpeechToTextV1
}
