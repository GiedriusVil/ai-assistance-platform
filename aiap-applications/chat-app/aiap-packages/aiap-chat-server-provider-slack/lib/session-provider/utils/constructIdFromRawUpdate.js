/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const constructIdFromRawUpdate = (rawUpdate) => {
    
    const USER_ID = ramda.path(['user'], rawUpdate);
    
    const CHANNEL_ID = ramda.path(['channel'], rawUpdate);
    
    const RET_VAL = `${CHANNEL_ID}.${USER_ID}.00000112`;

    return RET_VAL;
}

module.exports = {
    constructIdFromRawUpdate,
}; 
