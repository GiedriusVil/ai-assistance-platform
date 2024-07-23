/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const { AcaAiTestExecutorKFold } = require('./lib/executor-k-fold');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

let aiTestExecutor;

const getAcaAiTestExecutor = () => {
    if (lodash.isEmpty(aiTestExecutor)) {
        aiTestExecutor = new AcaAiTestExecutorKFold(); 
    }
    return aiTestExecutor;
}

module.exports = {
    getAcaAiTestExecutor, 
};
