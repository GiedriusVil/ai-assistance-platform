/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('ORGANIZATIONS_MEMORY_STORE_ENABLED', false, {});
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
