/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  IDeleteLambdaModulesByIdsParamsV1,
} from '../../types';

const publishDeleteEvents = (context: IContextV1, ids: any[]) => {
  try {
    if (
      !lodash.isEmpty(ids) &&
      lodash.isArray(ids)
    ) {
      for (let id of ids) {
        getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.DELETE_LAMBDA_MODULE, { id });
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('publishDeleteEvents');
    throw ACA_ERROR;
  }
}

const deleteManyByIds = async (
  context: IContextV1, 
  params: IDeleteLambdaModulesByIdsParamsV1
  ) => {
  let ids;
  try {
    ids = params?.ids;
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.modules.deleteManyByIds(context, params);
    const AUDIT_PARAMS = {
      action: 'DELETE_MANY_BY_IDS',
      docId: null,
      docType: 'MODULES',
      doc: { ids }
    };
    lambdaModulesAuditorService.saveOne(context, AUDIT_PARAMS);
    publishDeleteEvents(context, ids);

    await runtimeDataService.deleteManyByIdsFromConfigDirectoryModule(context, { ids });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByIds,
}
