/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-access-groups-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  IAccessGroupV1Changes,
  // api
  IParamsV1SaveAccessGroupV1Changes,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  DatasourceAppV1Mongo,
} from '..';

import {
  findOneById,
} from './find-one-by-id';

export const saveOne = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1SaveAccessGroupV1Changes,
): Promise<IAccessGroupV1Changes> => {
  const CONTEXT_USER_ID = context?.user?.id;
  let value;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const MESSAGE = `Missing required params.record parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    value = params?.value;

    const MONGO_CLIENT = await datasource._getMongoClient();

    const RESPONSE = await MONGO_CLIENT
      .__insertOne(context,
        {
          collection: datasource._collections.accessGroupsChanges,
          doc: value,
        });

    const PARAMS_FIND_ONE_BY_ID = {
      id: RESPONSE?.insertedId?.toString(),
    };

    const RET_VAL = await findOneById(datasource, context, PARAMS_FIND_ONE_BY_ID);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, value });
    throw ACA_ERROR;
  }
}
