/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-json-group-by-groub-by-as-array-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { JSONPath } = require('@ibm-aca/aca-wrapper-jsonpath-plus');

const _constructGroupProperties = (properties, item,) => {
  const RET_VAL = {};
  try {
    if (
      !lodash.isObject(item)
    ) {
      const ERROR_MESSAGE = `Wrong type of item parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    for (let property of properties) {
      RET_VAL[property] = JSONPath({
        path: property,
        json: item,
        wrap: false,
      });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_constructGroupProperties.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const groupByAsArray = (items, properties) => {
  const RET_VAL = [];
  try {

    for (let item of items) {
      let props = _constructGroupProperties(properties, item);
      let group = RET_VAL.find((item) => {
        return lodash.isEqual(item?.props, props);
      });
      if (
        lodash.isEmpty(group)
      ) {
        group = {
          props: props,
          values: []
        };
        RET_VAL.push(group);
      }
      group.values.push(item);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(groupByAsArray.name);
    throw ACA_ERROR;
  }
}


module.exports = {
  groupByAsArray,
};
