/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-buckets-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  CHANGE_ACTION,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  IBucketSaveOneParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  getObjectStorageClientByTenant,
} from '@ibm-aiap/aiap-object-storage-client-provider';

import {
  getDatasourceByContext,
} from '../datasource-utils';

import * as bucketsChangesService from '../buckets-changes';

import {
  findOneById,
} from './find-one-by-id';

const _ensureBucketExternalExistance = async (
  context: IContextV1,
  params: IBucketSaveOneParamsV1,
) => {
  try {
    const OBJECT_STORAGE_CLIENT = getObjectStorageClientByTenant(context?.user?.session?.tenant);
    if (
      lodash.isEmpty(params?.value?.id)
    ) {
      params.value.external = {
        name: params?.value?.reference,
      }
    }
    const EXISTS_EXTERNALY = await OBJECT_STORAGE_CLIENT.checkBucketExistance(
      context,
      {
        name: params?.value?.external?.name,
      }
    );
    if (
      !EXISTS_EXTERNALY
    ) {
      await OBJECT_STORAGE_CLIENT.saveBucket(
        context,
        {
          value: {
            name: params?.value?.external?.name,
          }
        }
      );
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_ensureBucketExternalExistance.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _saveBucketChanges = async (
  context: IContextV1,
  params: IBucketSaveOneParamsV1,
) => {
  try {
    const CHANGES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const VALUE = {
      action: CHANGE_ACTION.SAVE_ONE,
      docId: params?.value?.id,
      docType: 'BUCKET',
      docName: params?.value?.reference,
      docChanges: CHANGES,
      doc: params?.value,
      timestamp: new Date(),
    };

    await bucketsChangesService.saveOne(
      context,
      {
        value: VALUE,
      }
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_saveBucketChanges.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (
  context: IContextV1,
  params: IBucketSaveOneParamsV1,
) => {
  try {
    appendAuditInfo(context, params?.value);
    // TODO LEGO
    // Following logic some how needs to be within a single transaction
    await _ensureBucketExternalExistance(context, params);
    await _saveBucketChanges(context, params);

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.buckets.saveOne(context, params);

    const OBJECT_STORAGE_CLIENT = getObjectStorageClientByTenant(context?.user?.session?.tenant);
    await OBJECT_STORAGE_CLIENT.saveBucketTags(
      context,
      {
        name: params?.value?.external?.name,
        tags: {
          ['aiap-id']: RET_VAL?.id,
          ['aiap-reference']: RET_VAL?.reference,
        }
      },
    );

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
