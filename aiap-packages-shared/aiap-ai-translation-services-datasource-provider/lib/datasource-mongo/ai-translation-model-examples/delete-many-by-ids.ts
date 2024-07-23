/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo-ai-translation-model-examples-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  ReadPreference 
} from 'mongodb';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  appendDataToError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelExamplesDeleteManyByIdsParamsV1,
  IAiTranslationModelExamplesDeleteManyByIdsResponseV1
} from '../../types';

import {
  AiTranslationServicesDatasourceMongoV1
} from '..';


const deleteManyByIds = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationModelExamplesDeleteManyByIdsParamsV1,
): Promise<IAiTranslationModelExamplesDeleteManyByIdsResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const IDS = params?.ids;
  const MODEL_IDS = params?.modelIds;
  const SERVICE_IDS = params?.serviceIds;
  const OPTIONS = params?.options;

  const COLLECTION = datasource._collections.aiTranslationModelExamples;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let filter;
  try {
    if (
      lodash.isEmpty(IDS) &&
      lodash.isEmpty(MODEL_IDS) &&
      lodash.isEmpty(SERVICE_IDS)
    ) {
      const MESSAGE = `Parameters params.ids, params.modelIds, params.serviceIds are empty!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (!lodash.isEmpty(SERVICE_IDS)) {
      filter = {
        serviceId: {
          $in: SERVICE_IDS
        }
      };
    }

    if (!lodash.isEmpty(MODEL_IDS)) {
      filter = {
        modelId: {
          $in: MODEL_IDS
        }
      };
    }

    if (!lodash.isEmpty(IDS)) {
      filter = {
        _id: {
          $in: IDS
        }
      };
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
        options: OPTIONS
      });
    
    const RET_VAL: IAiTranslationModelExamplesDeleteManyByIdsResponseV1 = {
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, IDS, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteManyByIds
}
