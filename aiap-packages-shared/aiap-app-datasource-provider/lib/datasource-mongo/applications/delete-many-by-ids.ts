/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-app-datasource-mongo-applications-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  ReadPreference,
} from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteApplicationsByIds,
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

export const deleteManyByIds = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1DeleteApplicationsByIds,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.applications;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let filter;
  try {
    if (
      lodash.isEmpty(params?.ids)
    ) {
      const ERROR_MESSAGE = `Required parameter params.ids is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    for (const ID of params.ids) {
      if (
        !validator.isMongoId(ID) &&
        !validator.isAlphanumeric(ID, 'en-US', { ignore: '_-' })
      ) {
        const ERROR_MESSAGE = 'Required parameter params.ids[i] is invalid';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
    }

    filter = {
      _id: {
        $in: params?.ids,
      }
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = {
      ids: params?.ids,
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
