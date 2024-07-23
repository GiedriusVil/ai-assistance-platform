/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-mongo-engagements-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';


import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  ReadPreference
} from 'mongodb';

import {
  EngagementsDatasourceMongo
} from '..';

import {
  IDeleteEngagementsByIdsParamsV1,
  IDeleteEngagementsByIdsResponseV1
} from '../../types';

export const deleteManyByIds = async (
  datasource: EngagementsDatasourceMongo,
  context: IContextV1,
  params: IDeleteEngagementsByIdsParamsV1
): Promise<IDeleteEngagementsByIdsResponseV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.engagements;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };
  const PARAMS_IDS = params?.ids;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(PARAMS_IDS)
    ) {
      const MESSAGE = `Wrong type params.ids parameter! [Expected - Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: {
        $in: PARAMS_IDS
      }
    };
    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = {
      ids: PARAMS_IDS,
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
