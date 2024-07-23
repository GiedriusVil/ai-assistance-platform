/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { getApplicationUrl } = require('../queries/compile-one/get-application-url');
const { getDatasourceByContext } = require('../datasource.utils');

const findManyByQuery = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const QUERIES = await DATASOURCE.queries.findManyByQuery(context, params);
    const QUERIES_WITH_HEALTHCECKS = await performQueriesHealthCheck(context, QUERIES);
    return QUERIES_WITH_HEALTHCECKS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const performQueriesHealthCheck = async (context, queries) => {
  const RET_VAL = [];
  const QUERIES_ITEMS = queries?.items;
  const COMPILED_PROMISE = [];
  try {
    for (let query of QUERIES_ITEMS) {
      const URL = getApplicationUrl(context, query);
      if (URL?.data?.basePathError) {
        COMPILED_PROMISE.push(URL);
      } else {
        COMPILED_PROMISE.push(sendRequestToApp(URL, query));
      }
    }
    const RESOLVED_QUERIES = await Promise.all(COMPILED_PROMISE);
    if (lodash.isArray(RESOLVED_QUERIES) && !lodash.isEmpty(RESOLVED_QUERIES)) {
      RET_VAL.push(...RESOLVED_QUERIES);
      queries.healthCheck = RET_VAL;
      return queries;
    } else {
      return queries;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${performQueriesHealthCheck.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const sendRequestToApp = async (url, query) => {
  try {
    const QUERY_ID = query?.id;
    const QUERY_CODE = query?.code;
    const TIMEOUT = 2000;
    const RETRY = 2;
    const REQUEST_OPTIONS = {
      url: url,
      body: {
        id: QUERY_ID,
        code: QUERY_CODE
      },
      options: {
        timeout: TIMEOUT,
        retry: RETRY,
      },
    };
    logger.info('REQUEST:', {
      options: REQUEST_OPTIONS
    });
    const RESPONSE = await execHttpPostRequest({}, REQUEST_OPTIONS);
    return RESPONSE.body;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { apiError: true });
    logger.error(`${sendRequestToApp.name}`, { ACA_ERROR });
    return ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
