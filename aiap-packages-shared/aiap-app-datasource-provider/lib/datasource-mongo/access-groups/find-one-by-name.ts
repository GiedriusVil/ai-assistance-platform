/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-access-groups-find-one-by-name';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  IAccessGroupV1,
  // api
  IParamsV1FindAccessGroupByName,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  DatasourceAppV1Mongo,
} from '..';

export const findOneByName = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindAccessGroupByName,
): Promise<IAccessGroupV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_NAME = params?.name;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_NAME)
    ) {
      const ERROR_MESSAGE = `Required parameter params.name is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isString(PARAMS_NAME)
    ) {
      const ERROR_MESSAGE = 'Required parameter params.name must be a string!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    filter = {
      name: {
        $eq: PARAMS_NAME
      }
    }
    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: datasource._collections.accessGroups,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneByName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
