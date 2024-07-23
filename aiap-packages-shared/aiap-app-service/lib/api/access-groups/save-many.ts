/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAccessGroupV1,
  IParamsV1SaveAccessGroups,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  saveOne,
} from './save-one';

export const saveMany = async (
  context: IContextV1,
  params: IParamsV1SaveAccessGroups,
): Promise<Array<IAccessGroupV1>> => {
  try {
    if (
      !lodash.isArray(params?.values)
    ) {
      const ERROR_MESSAGE = 'Wrong type of params.accessGroups attribute! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PROMISES = params.values.map((value: IAccessGroupV1) => {
      return saveOne(context, { value });
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
