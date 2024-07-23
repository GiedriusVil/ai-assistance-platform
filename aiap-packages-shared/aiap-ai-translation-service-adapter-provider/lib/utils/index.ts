/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IAiTranslationModelExternalWLTV1 } from '@ibm-aiap/aiap--types-server';

enum AI_TRANSLATION_MODEL_STATUS {
  DRAFT = 'DRAFT',
  TRAINING = 'TRAINING',
  AVAILABLE = 'AVAILABLE',
  ERROR = 'ERROR',
};

/**
 * Converts WLT statuses to AI Translation Model statuses
 * More info: https://cloud.ibm.com/apidocs/language-translator?code=node#createmodel
 */
const getModelStatus = (WLTmodel: IAiTranslationModelExternalWLTV1) => {
  const MODEL_STATUS = WLTmodel.status;

  let retVal;

  switch (MODEL_STATUS) {
    case 'uploading':
    case 'uploaded':
    case 'dispatching':
    case 'queued':
    case 'training':
    case 'trained':
    case 'publishing':
      retVal = AI_TRANSLATION_MODEL_STATUS.TRAINING;
      break;
    case 'available':
      retVal = AI_TRANSLATION_MODEL_STATUS.AVAILABLE;
      break;
    case 'deleted':
    case 'error':
      retVal = AI_TRANSLATION_MODEL_STATUS.ERROR;
      break;
    default:
      retVal = AI_TRANSLATION_MODEL_STATUS.DRAFT;
  }

  return retVal;
}

export {
  AI_TRANSLATION_MODEL_STATUS,
  getModelStatus,
};
