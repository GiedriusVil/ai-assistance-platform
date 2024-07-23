/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('FULFILL_ENABLED', true, {});
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
