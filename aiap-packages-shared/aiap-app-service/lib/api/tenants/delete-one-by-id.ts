/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-tenants-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteTenantById, IResponseV1DeleteTenantById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import * as tenantsChangesService from '../tenants-changes';
import * as runtimeDataService from '../runtime-data';

const saveAuditRecord = async (
  context,
  params: {
    id: any
  },
) => {
  try {
    const CHANGE = {
      action: CHANGE_ACTION.DELETE_ONE_BY_ID,
      docId: params.id,
      docType: 'TENANT',
      docName: params?.id,
      doc: null,
      docChanges: null,
      timestamp: new Date(),
    }
    await tenantsChangesService.saveOne(context, { value: CHANGE });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveAuditRecord.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const deleteOneById = async (
  context: IContextV1,
  params: IParamsV1DeleteTenantById,
): Promise<IResponseV1DeleteTenantById> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const ID = params?.id;
  try {
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.tenants.deleteOneById(context, params);
    if (
      RET_VAL
    ) {
      await saveAuditRecord(context, params);
    }
    await runtimeDataService.deleteManyByIdsFromConfigDirectoryTenant(context, { ids: [ID] });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, ID });
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
