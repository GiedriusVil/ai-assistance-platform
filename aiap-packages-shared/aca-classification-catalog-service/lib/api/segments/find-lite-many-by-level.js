/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-find-lite-many-by-level';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const _classificationCatalogUtils = require('../../utils/classification-catalog-utils');

const LEVEL_TYPE = {
  SEGMENT: 'SEGMENT',
  FAMILY: 'FAMILY',
  CLASS: 'CLASS',
  SUBCLASS: 'SUBCLASS',
};

const _findLiteManyByLevel = async (context, params) => {
  try {
    const PROMISES = [];
    const DATASOURCE = getDatasourceByContext(context);

    const LANGUAGE = ramda.path(['language'], params);
    const LEVEL = ramda.path(['level'], params);
    const INCLUDE_PARENT = ramda.path(['includeParent'], params);
    const IDS = ramda.path(['ids'], params);

    const PARSED_LANGUAGE = _classificationCatalogUtils.parseIsoLangCode(LANGUAGE);
    const MESSAGE_UNKNOWN_LEVEL = 'Level is unknown!';
    let retVal;
    switch (LEVEL) {
      case LEVEL_TYPE.SEGMENT:
        IDS.forEach(id => {
          const PARAMS = {
            id: id,
            language: PARSED_LANGUAGE,
          };
          PROMISES.push(DATASOURCE.segments.findLiteOneById(context, PARAMS));
        });
        break;
      case LEVEL_TYPE.FAMILY:
        IDS.forEach(id => {
          const PARAMS = {
            id: id,
            language: PARSED_LANGUAGE,
            includeParent: INCLUDE_PARENT
          };
          PROMISES.push(DATASOURCE.families.findLiteOneById(context, PARAMS));
        });
        break;
      case LEVEL_TYPE.CLASS:
        IDS.forEach(id => {
          const PARAMS = {
            id: id,
            language: PARSED_LANGUAGE,
            includeParent: INCLUDE_PARENT
          };
          PROMISES.push(DATASOURCE.classes.findLiteOneById(context, PARAMS));
        });
        break;
      case LEVEL_TYPE.SUBCLASS:
        IDS.forEach(id => {
          const PARAMS = {
            id: id,
            language: PARSED_LANGUAGE,
            includeParent: INCLUDE_PARENT
          };
          PROMISES.push(DATASOURCE.subClasses.findLiteOneById(context, PARAMS));
        });
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE_UNKNOWN_LEVEL);
        break;
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findLiteManyByLevel = async (context, params) => {
  try {
    const RET_VAL = await _findLiteManyByLevel(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${findLiteManyByLevel.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findLiteManyByLevel,
}
