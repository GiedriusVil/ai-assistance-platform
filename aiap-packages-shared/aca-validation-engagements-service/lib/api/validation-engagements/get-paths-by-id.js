/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-validation-engagements-get-paths-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const { decodeAndInitialiseEngagement } = require('../../utils');

// LEGO - 2023-01-21 - Lets keep this function for time being.
// const isRequired = (key) => {
//   let retVal = false;
//   if (
//     !lodash.isEmpty(key?.flags?.presence)
//   ) {
//     if (
//       key.flags.presence === 'required'
//     ) {
//       retVal = true;
//     }
//   }
//   return retVal;
// }

const addJoiKeyPathsToArray = (key, keyName, pathsStack, pathsArray) => {
  let pathString = pathsStack;
  if (
    !lodash.isEmpty(keyName)
  ) {
    pathString += `.${keyName}`;
  }
  if (key?.type === 'array') {
    for (let arrItem of key.items) {
      addJoiKeyPathsToArray(arrItem, '', `${pathString}[*]`, pathsArray);
    }
  } else if (key?.type === 'object') {
    for (const [objName, objValue] of Object.entries(key.keys)) {
      addJoiKeyPathsToArray(objValue, objName, pathString, pathsArray);
    }
  } else {
    const KEY_METADATA = key?.metas?.[0];
    const KEY_TYPE = key?.type;
    let pathObject = {
      content: pathString,
      value: {
        path: pathString,
        type: KEY_TYPE,
      }
    }
    if (
      !lodash.isEmpty(KEY_METADATA)
    ) {
      pathObject.value.metadata = KEY_METADATA;
    }
    pathsArray.push(pathObject);
  }
}

// const transformJoiToPathsArray = (joiKeys) => {
//   const PATHS_ARRAY = [];
//   if (lodash.isObject(joiKeys)) {
//     for (const [objName, objValue] of Object.entries(joiKeys)) {
//       addJoiKeyPathsToArray(objValue, objName, '$', PATHS_ARRAY);
//     }
//   }
//   return PATHS_ARRAY;
// }

const _appendSchemaPathsToTarget = (schema, target) => {
  if (
    !lodash.isEmpty(schema) &&
    lodash.isFunction(schema.describe) &&
    lodash.isArray(target)
  ) {
    const SCHEMA_DESCRIBE_KEYS = schema.describe().keys;
    if (
      lodash.isObject(SCHEMA_DESCRIBE_KEYS)
    ) {
      for (const [objName, objValue] of Object.entries(SCHEMA_DESCRIBE_KEYS)) {
        addJoiKeyPathsToArray(objValue, objName, '$', target);
      }
    }
  }
}

const _appendAggregationPathsToTarget = (aggregation, target) => {
  if (
    lodash.isObject(aggregation) &&
    lodash.isArray(target)
  ) {
    for (let [key, value] of Object.entries(aggregation)) {
      if (
        !lodash.isEmpty(value?.fields) &&
        lodash.isArray(value?.fields)
      ) {
        for (let field of value.fields) {
          if (
            !lodash.isEmpty(field?.field) &&
            !lodash.isEmpty(field?.operator)
          ) {
            let path = `$.${key}[*].['${field.field}.${field.operator}']`;
            let pathOption = {
              content: path,
              value: {
                path: path,
                type: field?.type,
              }
            }
            target.push(pathOption);
          }
        }
      }
    }
  }
}

const getPathsById = async (context, params) => {
  const RET_VAL = [];
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const VALIDATION_ENGAGEMENT = await DATASOURCE.validationEngagements.findOneById(context, params);

    const ENGAGEMENT_CLASS = await decodeAndInitialiseEngagement(context, { engagement: VALIDATION_ENGAGEMENT });
    const SCHEMA = ENGAGEMENT_CLASS?.SCHEMA;
    const AGGREGATION = ENGAGEMENT_CLASS?.AGGREGATION;
    _appendSchemaPathsToTarget(SCHEMA, RET_VAL);
    _appendAggregationPathsToTarget(AGGREGATION, RET_VAL);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getPathsById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  getPathsById,
}
