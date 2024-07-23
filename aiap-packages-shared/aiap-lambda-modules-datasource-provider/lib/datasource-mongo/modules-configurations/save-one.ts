/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-modules-configurations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import validator from 'validator';
import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import { 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1, 
  ILambdaModuleConfigurationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  LambdaModulesDatasourceMongoV1,
} from '../';

import {
  ISaveLambdaModuleConfigurationParamsV1
} from '../../types';

import { findOneById } from './find-one-by-id';

const saveOne = async (
  datasource: LambdaModulesDatasourceMongoV1, 
  context: IContextV1,
  params: ISaveLambdaModuleConfigurationParamsV1): Promise<ILambdaModuleConfigurationV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.modulesConfigurations;

  let value;
  let valueId;

  let filter;
  let update;
  let updateOptions;
  try {
    value = params?.value;
    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    valueId = ramda.pathOr(uuidv4(), ['id'], value);

    if (
      validator.isUUID(valueId) ||
      validator.isAlphanumeric(valueId, 'en-US', { ignore: '_-' })
    ) {
      filter = { _id: { $eq: valueId } };
    } else {
      const ERROR_MESSAGE = `Parameter params.value.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    update = { $set: value };
    updateOptions = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: update,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
};
