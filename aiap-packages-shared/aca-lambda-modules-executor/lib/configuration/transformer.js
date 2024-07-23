/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const L_TYPES_AS_STRING = ramda.path(['LAMBDA_MODULES_EXECUTOR_L_TYPES'], rawConfiguration);
    const CONFIGURATION = { types: [] };
    if (
        !lodash.isEmpty(L_TYPES_AS_STRING) &&
        lodash.isString(L_TYPES_AS_STRING)
    ) {
        CONFIGURATION.types = L_TYPES_AS_STRING.split(',');
    }
    const RET_VAL = provider.isEnabled(
        'LAMBDA_MODULES_EXECUTOR_ENABLED',
        false,
        CONFIGURATION
    );
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
