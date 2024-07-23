/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-buckets-refresh-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError, throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  getDatasourceByContext,
} from '../datasource-utils';

const refreshOneById = async (
  context: IContextV1,
  params: {
    id: string,
  }
) => {
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const ERROR_MESSAGE = `Missing required params?.id paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const QUERY_FILES = {
      filter: {
        bucketId: params.id,
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    }
    const DATASOURCE = getDatasourceByContext(context);
    const QUERY_FILES_RESPONSE = await DATASOURCE.files.findManyByQuery(
      context,
      {
        query: QUERY_FILES
      }
    );
    let sizeQty = 0;
    let sizeWeight = 0;
    if (
      !lodash.isEmpty(QUERY_FILES_RESPONSE?.items) &&
      lodash.isArray(QUERY_FILES_RESPONSE?.items)
    ) {
      for (const FILE of QUERY_FILES_RESPONSE.items) {
        sizeQty++;
        if (
          FILE?.file?.size > 0
        ) {
          sizeWeight = sizeWeight + FILE?.file?.size;
        }
      }
    }
    const BUCKET = await DATASOURCE.buckets.findOneById(context, { id: params?.id });
    BUCKET.sizeQty = sizeQty;
    BUCKET.sizeWeight = sizeWeight;
    await DATASOURCE.buckets.saveOne(context, { value: BUCKET })
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(refreshOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  refreshOneById,
}
