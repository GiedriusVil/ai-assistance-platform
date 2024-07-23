/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-documents-append-aggregations-to-document';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { JSONPath } = require('@ibm-aca/aca-wrapper-jsonpath-plus');
const { groupByAsArray } = require('@ibm-aca/aca-utils-json-group-by');

const { decodeAndInitialiseEngagement } = require('../../utils');


const _appendAggregationFieldToGroup = (field, group) => {
  let values;
  let valuesSanitized;

  let aggregation;
  try {
    if (
      !lodash.isEmpty(field?.field) &&
      !lodash.isEmpty(field?.operator) &&
      lodash.isObject(group)
    ) {
      values = JSONPath({
        path: `$.values[*].${field?.field}`,
        json: group,
        wrap: false,
      });
      valuesSanitized = values.filter((item) => {
        return lodash.isNumber(item);
      });
      switch (field?.operator) {
        case 'SUM':
          aggregation = valuesSanitized.reduce((a, b) => {
            return a + b;
          }, 0);
          break;
        case 'AVG':
          aggregation = valuesSanitized.reduce((a, b) => {
            return a + b;
          }, 0);
          aggregation = aggregation / values.length;
          break;
        case 'MIN':
          aggregation = Math.min(...valuesSanitized);
          break;
        case 'MAX':
          aggregation = Math.max(...valuesSanitized);
          break;
        case 'COUNT':
          aggregation = values.length;
          break;
        default:
          break;
      }
      group[`${field.field}.${field.operator}`] = aggregation;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendAggregationFieldToGroup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendAggregationFieldsToGroup = (aggregation, group) => {
  try {
    if (
      !lodash.isEmpty(aggregation?.fields) &&
      lodash.isArray(aggregation?.fields)
    ) {
      for (let field of aggregation.fields) {
        _appendAggregationFieldToGroup(field, group);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendAggregationFieldsToGroup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendAggregationFieldsToGroups = (aggregation, groups) => {
  try {
    if (
      !lodash.isEmpty(groups) &&
      lodash.isArray(groups)
    ) {
      for (let group of groups) {
        _appendAggregationFieldsToGroup(aggregation, group);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendAggregationToDocument.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendAggregationToDocument = async (context, params) => {
  let document;
  let aggregation;

  let groups;
  try {
    document = params?.document;
    aggregation = params?.aggregation;
    if (
      lodash.isObject(document) &&
      !lodash.isEmpty(aggregation?.key)
    ) {
      const SELECTOR_VALUES = JSONPath({
        path: `$.${aggregation?.selector}`,
        json: document,
        wrap: false,
      })
      groups = groupByAsArray(SELECTOR_VALUES, aggregation?.group);
      _appendAggregationFieldsToGroups(aggregation, groups);
    }
    if (
      !lodash.isEmpty(groups) &&
      lodash.isArray(groups)
    ) {
      document[aggregation.key] = [...groups];
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendAggregationToDocument.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


const appendAggregationsToDocument = async (context, params) => {
  let engagement;
  let engagementId;
  let engagementModule;
  let engagementAggregation;
  let document;
  try {
    engagement = context?.user?.session?.engagement;
    engagementId = context?.user?.session?.engagement?.id;
    document = params?.document;
    if (
      lodash.isEmpty(engagement)
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.engagement attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(document)
    ) {
      const ERROR_MESSAGE = `Missing required params?.document attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    engagementModule = await decodeAndInitialiseEngagement(context, { engagement });
    engagementAggregation = engagementModule?.AGGREGATION;

    const PROMISES = [];
    if (
      lodash.isObject(engagementAggregation)
    ) {
      for (let [key, aggregation] of Object.entries(engagementAggregation)) {
        PROMISES.push(_appendAggregationToDocument(context, {
          document: document,
          aggregation: {
            key: key,
            ...aggregation,
          }
        }));
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { engagementId });
    logger.error(appendAggregationsToDocument.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  appendAggregationsToDocument,
}
