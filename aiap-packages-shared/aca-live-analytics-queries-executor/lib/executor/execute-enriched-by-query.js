/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lamdba-modules-executor-execute-enriched-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructExecuteFilters, enrichAggregationsWithFilters } = require('@ibm-aca/aca-live-analytics-filters-executor');

const { getOneByRefAndTenant } = require('../runtime-storage');


const executeEnrichedByQuery = async (ref, origin, context, params) => {

  let qAggregations;
  let qResults;

  let retVal;

  try {
    const TENANT = context?.user?.session?.tenant;
    const QUERY_ORIG = getOneByRefAndTenant({ tenant: TENANT, ref: ref });
    const QUERY = lodash.cloneDeep(QUERY_ORIG);

    if (
      QUERY &&
      QUERY.execute &&
      lodash.isFunction(QUERY.execute)
    ) {
      retVal = await QUERY.execute(context, params);
      return retVal;
    }
    
    if (
      !lodash.isEmpty(params?.filters)
    ) {
      await constructExecuteFilters(QUERY, params);
      await enrichAggregationsWithFilters(QUERY, params);
    }

    if (
      QUERY &&
      QUERY.aggregations &&
      lodash.isFunction(QUERY.aggregations)
    ) {
      qAggregations = await QUERY.aggregations(context, params);
    } else {
      qAggregations = await origin._aggregations(context, params);
    }
    params.qAggregations = qAggregations;


    if (
      QUERY &&
      QUERY.retrieveData &&
      lodash.isFunction(QUERY.retrieveData)
    ) {
      qResults = await QUERY.retrieveData(context, params);
    } else {
      qResults = await origin._retrieveData(context, params);
    }
    params.qResults = qResults;

    if (
      params.export &&
      QUERY &&
      QUERY.exportData &&
      lodash.isFunction(QUERY.exportData)
    ) {
      let retVal = await QUERY.exportData(context, params);
      return retVal;
    }

    if (
      QUERY &&
      QUERY.transformResults &&
      lodash.isFunction(QUERY.transformResults)
    ) {
      retVal = await QUERY.transformResults(context, params);
    } else {
      retVal = await origin._transformResults(context, params);
    }

    return retVal;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(executeEnrichedByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  executeEnrichedByQuery,
}
