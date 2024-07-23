/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-catalogs-find-all-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { execHttpGetRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const CATALOG_LEVEL_INDEX_KEYS = ['segmentIndex', 'familyIndex', 'classIndex', 'subClassIndex'];

const _retrieveIndexStatus = async (context, catalog, key) => {
  const SEMANTIC_SEARCH_URL = context?.user?.session?.tenant?.semanticSearchBaseUrl;
  let retVal;

  let requestUrl;
  let requestOptions;

  let response;
  let responseBody;
  try {
    if (
      lodash.isEmpty(SEMANTIC_SEARCH_URL)
    ) {
      const MESSAGE = `Missing required context.user.session.tenant.semanticSearchBaseUrl parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const INDEX_ID = ramda.path([`${key}Id`], catalog);

    requestUrl = SEMANTIC_SEARCH_URL + '/api/vectors-index/status?indexId=' + INDEX_ID;
    requestOptions = {
      url: requestUrl,
      options: {
        timeout: 2000,
      },
    }

    response = await execHttpGetRequest({}, requestOptions);
    responseBody = response?.body;

    const INDEX_STATUS = ramda.path(['statusHistory', 0, 'status'], responseBody);
    const INDEX_STATUS_TIMESTAMP = ramda.path(['statusHistory', 0, 'timestamp'], responseBody);

    if (
      !lodash.isEmpty(INDEX_STATUS_TIMESTAMP) ||
      !lodash.isEmpty(INDEX_STATUS)
    ) {
      const INDEX_TIMESTAMP_STRINGS = INDEX_STATUS_TIMESTAMP.toString().split('.');
      const INDEX_DATE = new Date(INDEX_TIMESTAMP_STRINGS[0] * 1000).toISOString();
      retVal = {
        level: key,
        status: INDEX_STATUS,
        timestamp: INDEX_DATE,
      };
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { requestUrl, requestOptions, responseBody });
    logger.error(_retrieveIndexStatus.name, { ACA_ERROR });
  }
}


const _loadCatalogIndexStatus = async (context, params) => {
  const CATALOG = params?.catalog;
  try {
    if (
      lodash.isEmpty(CATALOG)
    ) {
      const MESSAGE = `Missing required params.catalog parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let key of CATALOG_LEVEL_INDEX_KEYS) {
      PROMISES.push(_retrieveIndexStatus(context, CATALOG, key));
    }
    const PROMSISES_RESULTS = await Promise.all(PROMISES);
    CATALOG.indexStatus = PROMSISES_RESULTS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_loadCatalogIndexStatus.name, { ACA_ERROR });
    CATALOG.indexStatus = [];
  }
}

const findManyByQuery = async (context, params) => {
  let catalogs;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESPONSE = await DATASOURCE.catalogs.findManyByQuery(context, params);
    catalogs = RESPONSE?.items;
    const PROMISES = [];
    if (
      !lodash.isEmpty(catalogs) &&
      lodash.isArray(catalogs)
    ) {
      for (let catalog of catalogs) {
        PROMISES.push(_loadCatalogIndexStatus(context, { catalog }));
      }
    }
    await Promise.all(PROMISES);
    const RET_VAL = RESPONSE;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
