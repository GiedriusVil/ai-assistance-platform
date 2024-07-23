/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-services-find-one-by-name';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IFindAiServiceByNameParamsV1,
} from '../../types/params/ai-services';

import {
  decryptAiServicePassword,
} from '../utils';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const findOneByName = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiServiceByNameParamsV1,
): Promise<IAiServiceV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServices;

  let name: any;
  let filter;
  try {
    if (
      lodash.isEmpty(params?.name)
    ) {
      const MESSAGE = `Missing required params.name parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    name = params?.name;

    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    };
    filter = { name };

    const MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = RESPONSE?.[0];
    if (!lodash.isEmpty(RET_VAL)) {
      decryptAiServicePassword(datasource.configuration.encryptionKey, RET_VAL);
      sanitizeIdAttribute(RET_VAL);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, name, filter });
    logger.error(findOneByName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

