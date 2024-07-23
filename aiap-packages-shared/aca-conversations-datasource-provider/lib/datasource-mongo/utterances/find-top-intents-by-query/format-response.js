

/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const formatResponse = (items) => {
    const RET_VAL = items.map(item => item.intent);
    return RET_VAL;
}

module.exports = {
    formatResponse
}
