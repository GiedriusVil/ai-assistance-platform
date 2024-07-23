/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-utils-deserialize-classification-rule-dates';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _deserializeDateByPath = (path, value) => {
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

const deserializeClassificationRuleDates = (rule) => {
  let retValue = lodash.cloneDeep(rule);
    try {
        if (
            lodash.isObject(retValue)
        ) {
          retValue = _deserializeDateByPath(['effective'], retValue);
          retValue = _deserializeDateByPath(['expires'], retValue);
          retValue = _deserializeDateByPath(['created', 'date'], retValue);
          retValue = _deserializeDateByPath(['updated', 'date'], retValue);
        }
        return retValue;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { retValue });
        logger.error(`${deserializeClassificationRuleDates.name}`, { errors: [ACA_ERROR] });
        throw ACA_ERROR;
    }
}

module.exports = {
  deserializeClassificationRuleDates,
}
