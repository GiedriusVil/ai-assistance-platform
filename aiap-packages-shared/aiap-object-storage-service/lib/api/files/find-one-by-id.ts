/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-files-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileFindOneByIdParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  getDatasourceByContext,
} from '../datasource-utils';


const findOneById = async (
  context: IContextV1,
  params: IFileFindOneByIdParamsV1,
) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.files.findOneById(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findOneById,
}
