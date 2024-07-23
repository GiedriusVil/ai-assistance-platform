
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-utils-express-routes-middlewares-deserialize-dates-in-request-body-value`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

const _deserializeDateByPath = (
  path: any,
  value: any,
) => {
  let retVal;

  let dateAsString;
  let date;
  try {
    retVal = value;
    dateAsString = ramda.path(path, value);
    if (
      !lodash.isEmpty(dateAsString) &&
      lodash.isString(dateAsString)
    ) {
      date = new Date(dateAsString);
      retVal = ramda.assocPath(path, date, value);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { value });
    logger.error(`${_deserializeDateByPath.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const deserializeDatesInRequestBodyQuery = (
  request: any,
  response: any,
  next: any,
) => {
  let query;
  try {
    if (
      lodash.isObject(request?.body)
    ) {
      query = request?.body?.query;
      query = _deserializeDateByPath(['filter', 'dateRange', 'from'], query);
      query = _deserializeDateByPath(['filter', 'dateRange', 'to'], query);
      request.body.query = query;
    }
    next();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { query });
    logger.error(deserializeDatesInRequestBodyQuery.name, { errors: [ACA_ERROR] });
    response.status(500).json({ errors: [ACA_ERROR] })
  }
}

export const deserializeDatesInRequestBodyValue = (
  request: any,
  response: any,
  next: any,
) => {
  let value;
  try {
    if (
      lodash.isObject(request?.body)
    ) {
      value = request?.body?.value;
      value = _deserializeDateByPath(['effective'], value);
      value = _deserializeDateByPath(['expires'], value);
      value = _deserializeDateByPath(['created', 'date'], value);
      value = _deserializeDateByPath(['updated', 'date'], value);
      value = _deserializeDateByPath(['query', 'filter', 'dateRange', 'from'], value);
      value = _deserializeDateByPath(['query', 'filter', 'dateRange', 'to'], value);
      request.body.value = value;
    }
    next();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { value });
    logger.error(deserializeDatesInRequestBodyValue.name, { errors: [ACA_ERROR] });
    response.status(500).json({ errors: [ACA_ERROR] })
  }
}
