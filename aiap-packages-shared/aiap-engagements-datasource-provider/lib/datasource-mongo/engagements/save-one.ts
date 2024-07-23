/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-mongo-modules-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

const validator = require('validator');

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  findOneById,
} from './find-one-by-id';

import {
  EngagementsDatasourceMongo
} from '..';

import {
  IContextV1,
  IEngagementV1
} from '@ibm-aiap/aiap--types-server';

import {
  ISaveEngagementParamsV1
} from '../../types';

export const saveOne = async (
  datasource: EngagementsDatasourceMongo,
  context: IContextV1,
  params: ISaveEngagementParamsV1
): Promise<IEngagementV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.engagements;

  let value;
  let valueId;

  let filter = {};
  let updateCondition;
  let updateOptions;
  try {
    value = params?.value;
    if (
      lodash.isEmpty(value)
    ) {
      const ERROR_MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    valueId = ramda.pathOr(uuidv4(), ['id'], value);

    if (
      validator.isUUID(valueId) ||
      validator.isAlphanumeric(valueId, 'en-US', { ignore: '_-' })
    ) {
      filter = { _id: { $eq: valueId } };
    } else {
      const ERROR_MESSAGE = `Parameter params?.value?.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    delete value.id;

    updateCondition = { $set: value };
    updateOptions = { upsert: true };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
