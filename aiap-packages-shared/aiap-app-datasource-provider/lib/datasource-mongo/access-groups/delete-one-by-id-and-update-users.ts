/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-access-groups-delete-one-by-id-and-update-users';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  TransactionOptions,
  ReadPreference,
} from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteAccessGroupByIdAndUpdateUsers,
  IResponseV1DeleteAccessGroupByIdAndUpdateUsers,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  DatasourceAppV1Mongo,
} from '..';

export const deleteOneByIdAndUpdateUsers = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1DeleteAccessGroupByIdAndUpdateUsers,
): Promise<IResponseV1DeleteAccessGroupByIdAndUpdateUsers> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_ID = params?.id;
  let result;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !validator.isMongoId(PARAMS_ID) &&
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '$_-' })
    ) {
      const ERROR_MESSAGE = 'Invalid params.id attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const CLIENT = await datasource._getClient();
    const SESSION = CLIENT.startSession();
    result = { deletedCount: 0 };

    const TRANSACTION_OPTIONS: TransactionOptions = {
      readPreference: ReadPreference.primaryPreferred,
      readConcern: {
        level: 'majority',
      },
      writeConcern: {
        w: 'majority',
      },
    };
    const TRANSACTION_FUNCTION = async () => {
      const USERS_BY_ACCESS_GROUP_ID_FILTER = {
        accessGroupIds: {
          $elemMatch: {
            $eq: PARAMS_ID
          }
        }
      };
      const USERS_UPDATE_CONDITION = {
        $pull: {
          accessGroupIds: {
            $in: [PARAMS_ID]
          }
        }
      };
      const MONGO_CLIENT = await datasource._getMongoClient();
      await MONGO_CLIENT
        .__updateMany(context,
          {
            collection: datasource._collections.accessGroups,
            filter: USERS_BY_ACCESS_GROUP_ID_FILTER,
            update: USERS_UPDATE_CONDITION,
          });

      const DELETE_ACCESS_GROUP_FILTER = {
        _id: PARAMS_ID
      };

      result = await MONGO_CLIENT
        .__deleteOne(context, {
          collection: datasource._collections.accessGroups,
          filter: DELETE_ACCESS_GROUP_FILTER
        });

    };
    await SESSION.withTransaction(TRANSACTION_FUNCTION, TRANSACTION_OPTIONS);
    return result;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_ID, result });
    logger.error(deleteOneByIdAndUpdateUsers.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
