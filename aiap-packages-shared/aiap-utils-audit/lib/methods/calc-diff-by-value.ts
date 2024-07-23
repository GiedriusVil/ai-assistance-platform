/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-audit-calc-diff-by-value';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  deepDifference,
} from '@ibm-aca/aca-wrapper-obj-diff';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IHasFuncFindOneByIdV1,
} from '../types';

const calcDiffByValue = async (
  context: IContextV1,
  params: {
    service: IHasFuncFindOneByIdV1,
    value: {
      id?: string,
    }
  },
) => {
  let value: any;
  let valueId: string;
  let valueCurrent: any;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const ERROR_MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isFunction(params?.service?.findOneById)
    ) {
      const ERROR_MESSAGE = `Wrong type of required params?.service?.findOneById parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    value = params?.value;
    valueId = params?.value?.id;
    if (
      !lodash.isEmpty(valueId)
    ) {
      valueCurrent = await params.service.findOneById(context, { id: valueId });
    }
    const RET_VAL = deepDifference(valueCurrent, value);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      context: {
        user: {
          id: context?.user?.id,
        }
      },
      value: value,
      valueCurrent: valueCurrent,
    });
    logger.error(calcDiffByValue.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  calcDiffByValue,
}
