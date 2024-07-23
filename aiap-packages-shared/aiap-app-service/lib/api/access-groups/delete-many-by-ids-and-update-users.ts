/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-delete-many-by-ids-and-update-users';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteAccessGroupsByIdsAndUpdateUsers,
  IResponseV1DeleteAccessGroupByIdAndUpdateUsers,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  deleteOneByIdAndUpdateUsers,
} from './delete-one-by-id-and-update-users';

import * as runtimeDataService from '../runtime-data';

export const deleteManyByIdsAndUpdateUsers = async (
  context: IContextV1,
  params: IParamsV1DeleteAccessGroupsByIdsAndUpdateUsers,
): Promise<Array<IResponseV1DeleteAccessGroupByIdAndUpdateUsers>> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const IDS = params?.ids;
  let retVal;
  try {
    if (
      lodash.isEmpty(params?.ids)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (const ID of params.ids) {
      PROMISES.push(deleteOneByIdAndUpdateUsers(context, { id: ID, reason: params?.reason }));
    }
    retVal = await Promise.all(PROMISES);

    await runtimeDataService.deleteManyByIdsFromConfigDirectoryAccessGroup(context, { ids: IDS });
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, IDS });
    logger.error(deleteManyByIdsAndUpdateUsers.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

