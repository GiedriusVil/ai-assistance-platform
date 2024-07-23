/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  sanitizeIdAttribute
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IAiTranslationServiceV1
} from '@ibm-aiap/aiap--types-server';

import {
  IDatasourceConfigurationAITranslationServicesV1
} from '../../../types';

import {
  decryptAiTranslationServicePassword
} from '../../utils';

const formatResponse = (
    config: IDatasourceConfigurationAITranslationServicesV1,
    records: Array<any>,
  ): Array<IAiTranslationServiceV1> => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    for (let record of records) {
      decryptAiTranslationServicePassword(config.encryptionKey, record);
      sanitizeIdAttribute(record);
      RET_VAL.push(record);
    }
  }
  return RET_VAL;
};

export {
  formatResponse,
};
