/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-mongo-engagements-find-one-lite-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import { ReadPreference } from 'mongodb';

import {
  formatResponse,
} from './format-response';

import {
  IContextV1,
  IEngagementV1
} from '@ibm-aiap/aiap--types-server';

import {
  EngagementsDatasourceMongo
} from '../..';

import {
  IFindEngagementLiteByIdParamsV1
} from '../../../types';

export const findOneLiteById = async (
  datasource: EngagementsDatasourceMongo,
  context: IContextV1,
  params: IFindEngagementLiteByIdParamsV1
): Promise<IEngagementV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.engagements;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  const PARAMS_ID = params?.id;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: PARAMS_ID
    };
    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const RET_VAL = formatResponse(RESULT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneLiteById.name, { ACA_ERROR });
    throw error;
  }
}
