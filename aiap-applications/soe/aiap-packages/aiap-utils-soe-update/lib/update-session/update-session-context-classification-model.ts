/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-soe-update-update-classification-model';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IClassificationModelV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getUpdateSessionContextAttribute,
  setUpdateSessionContextAttribute,
} from '.';

import {
  getAcaClassifierDatasourceByTenant,
} from '@ibm-aca/aca-classifier-datasource-provider';

const SESSION_KEY_CLASSIFICATION_KEY = 'classification-model';

const ensureUpdateSessionContextClassificationModelExistance = async (
  update: ISoeUpdateV1,
) => {
  const G_ACA_PROPS = update?.raw?.gAcaProps;
  try {
    if (
      lodash.isEmpty(G_ACA_PROPS)
    ) {
      const MESSAGE = `Missing required update.gAcaProps parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    let model = getUpdateSessionContextAttribute(update, SESSION_KEY_CLASSIFICATION_KEY);
    if (
      lodash.isEmpty(model)
    ) {
      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: G_ACA_PROPS });
      const CLASSIFIER_DATASOURCE = getAcaClassifierDatasourceByTenant(TENANT);
      if (
        lodash.isEmpty(CLASSIFIER_DATASOURCE)
      ) {
        const MESSAGE = `Unable retriece classifier datasource!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const MODEL_ID = update?.raw?.engagement?.soe?.classifier?.model?.id;

      model = await CLASSIFIER_DATASOURCE.classifier.findOneById({}, { id: MODEL_ID });
      if (
        lodash.isEmpty(model)
      ) {
        const MESSAGE = `Unable to retrieve classifier model with id -> ${MODEL_ID}!`;
        throwAcaError(MODEL_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      setUpdateSessionContextAttribute(update, SESSION_KEY_CLASSIFICATION_KEY, model);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { G_ACA_PROPS });
    logger.error(ensureUpdateSessionContextClassificationModelExistance.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionContextClassificationModel = async (
  update: ISoeUpdateV1,
): Promise<IClassificationModelV1> => {
  const G_ACA_PROPS = update?.raw?.gAcaProps;
  try {
    await ensureUpdateSessionContextClassificationModelExistance(update);
    const RET_VAL = getUpdateSessionContextAttribute(update, SESSION_KEY_CLASSIFICATION_KEY);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { G_ACA_PROPS });
    logger.error(getUpdateSessionContextClassificationModel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSessionContextClassificationModelExistance,
  getUpdateSessionContextClassificationModel,
}
