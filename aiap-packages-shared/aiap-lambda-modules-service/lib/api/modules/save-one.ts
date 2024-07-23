/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-service-modules-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import deepDifference from 'deep-diff';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import { appendAuditInfo } from '@ibm-aiap/aiap-utils-audit';

import { lambdaModulesAuditorService } from '@ibm-aca/aca-auditor-service';

import {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} from '@ibm-aiap/aiap-event-stream-provider';

import { getDatasourceByContext } from '../datasource.utils';

import * as runtimeDataService from '../runtime-data';

import { findOneById } from './find-one-by-id';

import {
  ISaveLambdaModuleParamsV1
} from '../../types';

const _retrieveLambdaModulesChanges = async (context: IContextV1, newValue) => {
  let newValueId;
  let oldValue;
  try {
    newValueId = newValue?.id;
    if (
      !lodash.isEmpty(newValueId)
    ) {
      oldValue = await findOneById(context, { id: newValueId });
    }
    const RET_VAL = deepDifference(oldValue, newValue);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveLambdaModulesChanges.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (context: IContextV1, params: ISaveLambdaModuleParamsV1) => {
  let value;
  let valueId;
  let valueCode;
  try {
    value = params?.value;
    valueCode = params?.value?.code;
    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = 'Missing required params.value parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(valueCode)
    ) {
      const MESSAGE = 'Missing required params.value.code parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceByContext(context);
    const DOC_CHANGES = await _retrieveLambdaModulesChanges(context, value);
    appendAuditInfo(context, value);
    const RET_VAL = await DATASOURCE.modules.saveOne(context, params);
    valueId = RET_VAL?.id;

    const AUDITOR_PARAMS = {
      action: 'SAVE_ONE',
      docId: RET_VAL.id,
      docType: 'MODULE',
      doc: value,
      docChanges: DOC_CHANGES,
    };
    lambdaModulesAuditorService.saveOne(context, AUDITOR_PARAMS);

    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_LAMBDA_MODULE, { id: valueId });

    await runtimeDataService.synchronizeWithConfigDirectoryModule(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveOne,
}
