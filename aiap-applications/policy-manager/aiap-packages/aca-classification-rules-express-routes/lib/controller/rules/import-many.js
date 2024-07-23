/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-express-routes-controllers-classification-rules-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { rulesService } = require('@ibm-aca/aca-classification-rules-service');

const importMany = async (request, response) => {
    const ERRORS = [];
    let file;
    let params;
    let context;
    let result;
    try {
        file = request?.files?.classificationRuleFile;
        context = request?.acaContext;
        
        if (lodash.isEmpty(context)) {
            const MESSAGE = `Missing required request.acaContext parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
        }

        if (lodash.isEmpty(file)) {
            const MESSAGE = 'Missing required request.files.classificationRuleFile parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        params = { file };
        result = await rulesService.importMany(context, params);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(ERRORS)) {
        response.status(200).json(result);
    } else {
        logger.error(`${importMany.name}`, { errors: ERRORS });
        response.status(500).json({ errors: ERRORS });
    }

};

module.exports = {
    importMany,
};
