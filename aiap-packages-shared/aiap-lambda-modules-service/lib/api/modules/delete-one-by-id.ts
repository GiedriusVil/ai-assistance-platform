/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { getDatasourceByContext } from '../datasource.utils';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import {
  lambdaModulesAuditorService
} from '@ibm-aca/aca-auditor-service';

import {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} from '@ibm-aiap/aiap-event-stream-provider';

import * as runtimeDataService from '../runtime-data';

import {
  IDeleteLambdaModuleByIdParamsV1
} from '../../types';

const deleteOneById = async (
  context: IContextV1, 
  params: IDeleteLambdaModuleByIdParamsV1,
  ) => {
  const ID = params?.id;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.modules.deleteOneById(context, params);
    const AUDIT_PARAMS = {
      action: 'DELETE_MANY_BY_ID',
      docId: params.id,
      docType: 'MODULES',
      doc: { id: ID }
    };
    lambdaModulesAuditorService.saveOne(context, AUDIT_PARAMS);
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.DELETE_LAMBDA_MODULE, { id: ID });

    await runtimeDataService.deleteManyByIdsFromConfigDirectoryModule(context, { ids: [ID] });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteOneById,
}
