/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-applications-changes-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindApplicationV1ChangesById,
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

export const findOneById = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindApplicationV1ChangesById,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_ID = params?.id;

  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const ERROR_MESSAGE = `Required parameter params.id is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !validator.isMongoId(PARAMS_ID) &&
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Required parameter params.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    filter = { _id: { $eq: PARAMS_ID } };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: datasource._collections.applicationsChanges,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESULT);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_ID, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
