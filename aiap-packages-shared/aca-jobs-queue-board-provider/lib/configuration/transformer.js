/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('lodash');
const ramda = require('ramda');





const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('JOBS_QUEUE_BOARD_PROVIDER_ENABLED', false, {

    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
