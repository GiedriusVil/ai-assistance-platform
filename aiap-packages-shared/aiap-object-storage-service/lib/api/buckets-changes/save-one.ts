/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-buckets-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IBucketChangesSaveOneParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import { getDatasourceByContext } from '../datasource-utils';

const saveOne = async (
  context: IContextV1,
  params: IBucketChangesSaveOneParamsV1,
) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, params?.value);

    const RET_VAL = await DATASOURCE.bucketsChanges.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
}
