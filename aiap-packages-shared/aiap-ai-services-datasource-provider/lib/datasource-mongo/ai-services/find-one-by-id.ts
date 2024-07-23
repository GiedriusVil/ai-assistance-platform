/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-services-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
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
  IFindAiServiceByIdParamsV1,
} from '../../types/params/ai-services';

import {
  decryptAiServicePassword,
} from '../utils';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const findOneById = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiServiceByIdParamsV1,
): Promise<IAiServiceV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServices;

  let id;

  let filter;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    id = params?.id;

    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    };
    filter = {
      _id: id,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    if (!lodash.isEmpty(RET_VAL)) {
      decryptAiServicePassword(datasource.configuration.encryptionKey, RET_VAL);
      sanitizeIdAttribute(RET_VAL);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, id, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
