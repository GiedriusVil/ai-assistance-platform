/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-data-masking-provider-data-masking-service`;
// const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID); // TODO - figure out why this logger is not working!!!

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const fastRedact = require('fast-redact');

const { getManyFromRegistry } = require('../data-masking-registry');

const {
  MASKED_STRING,
  REPLACE_TYPE_ALL_MESSAGE,
  REPLACE_TYPE_MATCH_ONLY,
} = require('../constants');

const { getLibConfiguration } = require('../configuration');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const replaceMatch = (text, pattern) => {
  return text.replace(new RegExp(pattern, 'g'), MASKED_STRING);
}

const replaceAll = (text, pattern) => {
  if (text.match(pattern)) {
    return MASKED_STRING;
  }
  return text;
}

const maskItem = (text, pattern) => {
  let masked = text;
  if (pattern.replaceType === REPLACE_TYPE_MATCH_ONLY) {
    masked = replaceMatch(masked, pattern.pattern);
  } else if (pattern.replaceType === REPLACE_TYPE_ALL_MESSAGE) {
    masked = replaceAll(masked, pattern.pattern);
  } else {
    masked = replaceMatch(masked, pattern.pattern);
  }
  return masked;
}

const mask = (text, opts = {}) => {
  if (lodash.isEmpty(text)) {
    return text;
  }
  const patterns = getManyFromRegistry(opts.tenantId, opts.patternType);
  let masked = text;
  patterns.forEach(pattern => {
    masked = maskItem(masked, pattern);
  });
  return masked;
}

const searchObjAndMask = (obj, opts) => {
  if (!obj) return;
  for (let key of Object.keys(obj)) {
    if (lodash.isObject(obj[key]) && !lodash.isEmpty(obj[key])) {
      searchObjAndMask(obj[key], opts);
    }
    if (lodash.isString(obj[key])) {
      obj[key] = mask(obj[key], opts);
    }
  }
}

const maskObject = (obj, opts = {}) => {
  let maskedObj = ramda.clone(obj);

  if (!ramda.isEmpty(opts.pathsToMask)) {
    const redact = fastRedact({ paths: opts.pathsToMask, censor: MASKED_STRING, serialize: false });
    redact(maskedObj);
  }
  searchObjAndMask(maskedObj, opts);
  return maskedObj;
}


const getDisabledTenantIds = () => {
  let libConfiguration;
  let retVal = [];
  try {
    libConfiguration = getLibConfiguration();
    if (
      !lodash.isEmpty(libConfiguration?.disabledMaskingByTenant) &&
      lodash.isArray(libConfiguration?.disabledMaskingByTenant)
    ) {
      retVal = libConfiguration?.disabledMaskingByTenant;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { libConfiguration });
    // logger.error(getDisabledTenantIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  mask,
  maskObject,
  getDisabledTenantIds,
}
