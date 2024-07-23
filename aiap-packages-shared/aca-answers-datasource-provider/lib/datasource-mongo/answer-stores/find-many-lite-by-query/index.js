/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answer-stores-datasource-mongo-answer-stores-find-many-lite-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');
const { formatResponse } = require('./format-response');

const _answerStoreReleases = require('../../answer-store-releases');

const _retrieveLatestAnswerStoreRelease = async (datasource, context, params, ANSWER_STORES) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    if (lodash.isEmpty(ANSWER_STORES)) {
      return;
    }
    const PROMISES = [];
    for (let store of ANSWER_STORES) {
      const ANSWER_STORE_ID = store?._id;
      if (
        !lodash.isEmpty(ANSWER_STORE_ID)
      ) {
        const PARAMS = {
          answerStoreId: ANSWER_STORE_ID,
          sort: {
            field: 'deployedT',
            direction: 'desc',
          },
          pagination: {
            page: 1,
            size: 1,
          }
        };
        PROMISES.push(_answerStoreReleases.findManyByQuery(datasource, context, PARAMS));
      }
    }
    const RESULT = await Promise.all(PROMISES);
    ANSWER_STORES.forEach((store) => {
      const ANSWER_STORE_LATEST_RELEASE = RESULT.find((item) => {
        let condition = false;
        let tmpAnswerStoreLatestRelease = ramda.pathOr({}, ['items', 0], item);
        let tmpAnswerStoreId = ramda.path(['_id'], store);
        if (
          tmpAnswerStoreId === tmpAnswerStoreLatestRelease.answerStoreId
        ) {
          condition = true;
        }
        return condition;
      });
      if (!lodash.isEmpty(ANSWER_STORE_LATEST_RELEASE)) {
        store.latestReleaseDeployedTime = ramda.path(['items', 0, 'deployedT'], ANSWER_STORE_LATEST_RELEASE);
      }
    });

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(_retrieveLatestAnswerStoreRelease.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManyLiteByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;

  let query;
  try {
    query = aggregateQuery(params?.query);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query
      });
    
    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const ITEMS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(ITEMS.length, ['total'], RESULT);
    await _retrieveLatestAnswerStoreRelease(datasource, context, params, ITEMS);
    const RET_VAL = {
      items: formatResponse(ITEMS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findManyLiteByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyLiteByQuery
}
