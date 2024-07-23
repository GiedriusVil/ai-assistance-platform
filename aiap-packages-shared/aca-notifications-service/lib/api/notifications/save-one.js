/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-notifications-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getAcaNotificationsDatasource } = require('@ibm-aca/aca-notifications-datasource-provider');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getAcaNotificationsDatasource();
    const RET_VAL = await DATASOURCE.notifications.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', {ACA_ERROR});
    throw ACA_ERROR;
  }
}

module.exports = {
    saveOne,
}
