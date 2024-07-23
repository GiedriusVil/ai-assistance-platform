/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const ramda = require('ramda');
const lodash = require('lodash');

const transformToLiteUNSPSCCategory = (object, language) => {
    let retVal;
    if (
        !lodash.isEmpty(object)
    ) {
        retVal = {
            id: object.id, 
            title: ramda.path(['title', language], object),
        }
    }
    return retVal;
}

module.exports = {
    transformToLiteUNSPSCCategory,
}
