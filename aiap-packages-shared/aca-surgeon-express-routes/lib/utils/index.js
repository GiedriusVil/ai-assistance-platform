/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const sanitizeRegistry = (registry) => {
    const RET_VAL = {};
    if (
        !lodash.isEmpty(registry) &&
        lodash.isObject(registry)
    ) {
        for (let [key, value] of Object.entries(registry)) {
            RET_VAL[key] = {
                id: value?.id,
                hash: value?.hash,
                name: value?.name,
                status: value?.status,
                configuration: value?.configuration,
                _options: value?._options,
            }
        }
    }
    return RET_VAL;
}

module.exports = {
    sanitizeRegistry,
}
