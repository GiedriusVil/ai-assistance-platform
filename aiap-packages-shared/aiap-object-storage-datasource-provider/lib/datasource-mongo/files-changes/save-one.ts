/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiaip-object-storage-datasource-mongo-files-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

const validator = require('validator');

import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileChangesSaveOneParamsV1,
  IFileChangesV1,
} from '../../types';

import {
  ObjectStorageDatasourceMongoV1,
} from '..';

import {
  findOneById
} from './find-one-by-id';

const saveOne = async (
  datasource: ObjectStorageDatasourceMongoV1,
  context: IContextV1,
  params: IFileChangesSaveOneParamsV1,
): Promise<IFileChangesV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.filesChanges;

  let value;
  let valueId;

  let filter = {};
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const ERROR_MESSAGE = `Missing required params?.value paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    value = params?.value;
    valueId = lodash.isEmpty(value?.id) ? uuidv4() : value?.id;

    if (
      validator.isUUID(valueId) ||
      validator.isAlphanumeric(valueId, 'en-US', { ignore: '$_-' })
    ) {
      filter = {
        _id: {
          $eq: valueId,
        }
      };
    } else {
      const ERROR_MESSAGE = `Wrong type of params?.value?.id attribute! [Expected UUID or AlphaNumeric(en-US)]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    updateCondition = {
      $set: value,
    };
    updateOptions = {
      upsert: true,
    };

    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
}
