/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-module-executor-utils-decode';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  transformToAcaErrorFormat
} from '@ibm-aca/aca-data-transformer';

const _isBase64 = (value) => {
    const RET_VAL = Buffer.from(value, 'base64').toString('base64') === value;
    return RET_VAL;
}

const decodeValueWithBase64 = (value) => {
    const ERRORS = [];

    try {
        if (
            !lodash.isEmpty(value) &&
            lodash.isString(value) && 
            _isBase64(value)
        ) {
            const RET_VAL = Buffer.from(value, 'base64').toString('utf-8');
            return RET_VAL;
        }
    } catch(error) {
        const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
        ERRORS.push(ACA_ERROR);
        logger.error('->', {ERRORS});
    }
}

export {
    decodeValueWithBase64
}
