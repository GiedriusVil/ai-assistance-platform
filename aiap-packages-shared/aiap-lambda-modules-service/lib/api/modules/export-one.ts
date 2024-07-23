/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-export-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { getDatasourceByContext } from '../datasource.utils';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { lambdaModulesAuditorService } from '@ibm-aca/aca-auditor-service';

import {
  IFindLambdaModuleByIdParamsV1
} from '../../types';

const exportOne = async (
  context: IContextV1,
  params: IFindLambdaModuleByIdParamsV1
  ) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.modules.findOneById(context, params);
    const RET_VAL = [];
    RET_VAL.push(RESULT);
    const AUDIT_PARAMS = {
      action: 'EXPORT_LAMBDA_MODULE',
      docId: 'n/a',
      docType: 'MODULE',
      doc: RESULT,
    };
    lambdaModulesAuditorService.saveOne(context, AUDIT_PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  exportOne,
}
