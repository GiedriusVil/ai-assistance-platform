/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-express-routes-controllers-rules-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { rulesService } = require('@ibm-aca/aca-catalog-rules-service');

const importMany = async (request, response) => {
    const ERRORS = [];
    let context;
    let contextUserId;
    let file;
    let params;
    let result;
    try {
        context = request?.acaContext;
        contextUserId = context?.user?.id;
        file = request?.files?.catalogRuleFile;
        if (
            lodash.isEmpty(context)
        ) {
            const MESSAGE = `Missing required request.acaContext parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(file)
        ) {
            const MESSAGE = 'Missing required request.files.catalogRuleFile parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        params = { file };
        result = await rulesService.importMany(context, params);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { contextUserId });
        ERRORS.push(ACA_ERROR);
    }
    if (
        lodash.isEmpty(ERRORS)
    ) {
        response.status(200).json(result);
    } else {
        logger.error(`${importMany.name}`, { errors: ERRORS });
        response.status(500).json({ errors: ERRORS });
    }
};

module.exports = {
    importMany,
};
