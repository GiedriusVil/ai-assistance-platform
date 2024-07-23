/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-codec-decode-from-string-2-base64`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


// [LEGO] - > Need 2 thing about async decode options.... There are some algorythms which take their time...

const fromStringToBase64 = (params) => {
    const DATA = params;
    const BUFFER = new Buffer(DATA);
    const BASE_64_DATA = BUFFER.toString('base64');
    return BASE_64_DATA;
}

module.exports = {
    fromStringToBase64,
}
