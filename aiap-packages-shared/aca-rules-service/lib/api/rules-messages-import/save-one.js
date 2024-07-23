/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-messages-import-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
    getAcaRulesDatasourceByContext,
} = require('@ibm-aca/aca-rules-datasource-provider');

const saveOne = async (context, params) => {
    const PARAMS = {
        isImport: true,
        ...params,
    }
    const DATASOURCE = getAcaRulesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.rulesMessages.saveOne(context, PARAMS);
    return RET_VAL;
}

module.exports = {
    saveOne,
}
