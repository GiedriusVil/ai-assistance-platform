/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-catalogs-find-all-by-match';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const _classificationCatalogUtils = require('../../utils/classification-catalog-utils');

const findManyByMatch = async (context, params) => {
  const PARAMS_LANGUAGE = params?.language;
  const PARAMS_LIMIT = params?.limit;

  let input;
  let language;

  try {
    input = _classificationCatalogUtils.retrieveCanonicalFormByInput(params);
    language = _classificationCatalogUtils.parseIsoLangCode(PARAMS_LANGUAGE);

    const DATASOURCE = getDatasourceByContext(context);
    const PARAMS = {
      input: input,
      language: language,
      limit: PARAMS_LIMIT,
    };
    const RET_VAL = await DATASOURCE.catalogs.findManyByMatch(context, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params, input, language });
    logger.error(findManyByMatch.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByMatch,
}
