/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lamdba-modules-executor-execute-enriched-by-filter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getOneByRefAndTenant } = require('../runtime-storage');


const retrieveFilters = async (context, params) => {
  let filters;
  let tenant;
  let retVal = [];
  try {
    tenant = context?.user?.session?.tenant;
    filters = params?.filters;
    if (
      !lodash.isEmpty(filters) &&
      lodash.isArray(filters)
    ) {
      const PROMISES = [];
      for (let filter of filters) {
        PROMISES.push(getOneByRefAndTenant({ tenant: tenant, ref: filter?.ref }));
      }
      retVal = await Promise.all(PROMISES);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveFilters.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const constructExecuteFilters = async (query, params) => {
  try {
    if (!lodash.isEmpty(query)) {
      const executeFilters = async (_context, _params) => {
        const FILTERS_BY_REFS = await retrieveFilters(_context, _params);
        const FILTERS = [];
        for (let filter of FILTERS_BY_REFS) {
          const FILTER_FUNCTION = filter?.filter(_context, _params);
          FILTERS.push(FILTER_FUNCTION);
        }
        const FILTERS_SANITIZED = lodash.compact(FILTERS);
        const RET_VAL = {
          $match: {
            $and: FILTERS_SANITIZED
          }
        };
        return RET_VAL;
      }
      query.executeFilters = executeFilters;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveFilters.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const enrichAggregationsWithFilters = async (query, params) => {
  try {
    if (
      !lodash.isEmpty(query) &&
      lodash.isFunction(query.aggregations)
    ) {
      const AGGREGATIONS_FUNC_ORIGIN = query?.aggregations;
      const FILTERS_FUNC_ORIGIN = query?.executeFilters;

      const aggregations = async (_context, _params) => {

        let originalAggregations = await AGGREGATIONS_FUNC_ORIGIN(_context, _params);

        if (!lodash.isPlainObject(originalAggregations)) {
          const MESSAGE = 'Expecting an Object from aggregations() function return.';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        if (lodash.isEmpty(originalAggregations)) {
          return originalAggregations;
        }

        const ENRICHED_AGGREGATIONS = {};

        for (const [name, aggregation] of Object.entries(originalAggregations)) {

          let originalMatcher = aggregation?.[0];
          const FILTERS_MATCHER = await FILTERS_FUNC_ORIGIN(_context, _params);

          if (lodash.isEmpty(originalMatcher?.$match)) {
            originalMatcher = {};
          }

          if (
            lodash.isEmpty(originalMatcher) &&
            lodash.isArray(aggregation)
          ) {
            aggregation.unshift(FILTERS_MATCHER);
          } else if (
            lodash.isArray(originalMatcher?.$match?.$and)
          ) {
            originalMatcher.$match.$and.push(...FILTERS_MATCHER.$match.$and);
            aggregation[0] = originalMatcher;
          } else if (
            !lodash.isEmpty(originalMatcher?.$match) &&
            !originalMatcher?.$match?.$and
          ) {
            originalMatcher.$match.$and = FILTERS_MATCHER?.$match?.$and;
            aggregation[0] = originalMatcher;
          }

          ENRICHED_AGGREGATIONS[name] = aggregation;
        }

        return ENRICHED_AGGREGATIONS;
      }

      query.aggregations = aggregations;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveFilters.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  enrichAggregationsWithFilters,
  constructExecuteFilters,
}
