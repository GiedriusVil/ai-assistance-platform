/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-refresh-in-validate-all';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getOauth2DatasourceByContext } = require('../datasource.utils');

const {
  TOKEN_REFRESH_STATUS,
} = require('../../utils');

const inValidateAll = async (context, params) => {
  const PARAMS = {
    nFilter: {
      statuses: [
        TOKEN_REFRESH_STATUS.CANCELLED,
      ],
    },
    pagination: {
      page: 0,
      size: 1000,
    }
  };

  let oauth2Datasource;

  let tokensPage;
  let tokens;

  let promises = [];
  let promisesResult;

  let retVal;
  try {
    oauth2Datasource = getOauth2DatasourceByContext(context);

    tokensPage = await oauth2Datasource.oauth2TokensRefresh
      .findManyByQuery(context, PARAMS);

    tokens = tokensPage?.items;

    if (
      !lodash.isEmpty(tokens) &&
      lodash.isArray(tokens)
    ) {
      for (let token of tokens) {
        token.status = TOKEN_REFRESH_STATUS.CANCELLED;
        promises.push(
          oauth2Datasource
            .oauth2TokensRefresh.saveOne(context, { token })
        );
      }
      promisesResult = await Promise.all(promises);
    }
    if (
      !lodash.isEmpty(promisesResult) &&
      lodash.isArray(promisesResult)
    ) {
      for (let promiseResult of promisesResult) {
        logger.info(`TokenRefresh has been cancelled!`, { id: promiseResult?.id });
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(inValidateAll.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  inValidateAll,
}
