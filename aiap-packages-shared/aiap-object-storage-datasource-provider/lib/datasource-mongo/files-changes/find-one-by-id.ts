/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-datasource-mongo-files-changes-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileChangesFindOneByIdParamsV1,
  IFileChangesV1,
} from '../../types';

import {
  ObjectStorageDatasourceMongoV1,
} from '..';

const findOneById = async (
  datasource: ObjectStorageDatasourceMongoV1,
  context: IContextV1,
  params: IFileChangesFindOneByIdParamsV1,
): Promise<IFileChangesV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.filesChanges;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  let id;

  let filter = {};
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    id = params?.id;

    if (
      validator.isUUID(id) ||
      validator.isAlphanumeric(id, 'en-US', { ignore: '$_-' })
    ) {
      filter = {
        _id: {
          $eq: id
        }
      };
    } else {
      const ERROR_MESSAGE = `Wrong format of params?.id parameter! [Expected uuid or AlphaNumeric(en-US)]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, id, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findOneById,
}
