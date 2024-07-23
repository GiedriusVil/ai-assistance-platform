/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-tenants-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteTenentsByIds,
  IResponseV1DeleteTenantsByIds,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  deleteOneById,
} from './delete-one-by-id';

import * as runtimeDataService from '../runtime-data';

export const deleteManyByIds = async (
  context: IContextV1,
  params: IParamsV1DeleteTenentsByIds,
): Promise<IResponseV1DeleteTenantsByIds> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const IDS = params?.ids;
  try {
    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(IDS)
    ) {
      const MESSAGE = `Wrong type of params.ids parameter! [Array -> expected]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (const ID of IDS) {
      PROMISES.push(deleteOneById(context, { id: ID }));
    }
    const RET_VAL = await Promise.all(PROMISES);
    await runtimeDataService.deleteManyByIdsFromConfigDirectoryTenant(context, { ids: IDS })
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, IDS });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
