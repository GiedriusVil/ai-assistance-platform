/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-notifications-service-datasource-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getAcaNotificationsDatasource } = require('@ibm-aca/aca-notifications-datasource-provider');

const getNotificationsDatasource = (context) => {
    try {
        const RET_VAL = getAcaNotificationsDatasource();
        if (lodash.isEmpty(RET_VAL)) {
            const MESSAGE = `Unable to retrieve aca-notifications-datasource!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('getNotificationsDatasource', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    getNotificationsDatasource,
}
