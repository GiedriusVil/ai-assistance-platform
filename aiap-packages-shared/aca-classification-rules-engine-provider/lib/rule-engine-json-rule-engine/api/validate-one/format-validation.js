/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-engine-provider-json-rule-engine-api-validate-one-format-validation';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const formatValidation = async (context, document, validationRaw) => {
    const CONTEXT_USER_ID = context?.user?.id;
    let documentId;
    let events;
    const RET_VAL = [];
    try {
        documentId = document?.id;
        events = validationRaw?.events;
        if (
            !lodash.isEmpty(events) &&
            lodash.isArray(events)
        ) {
            for (let event of events) {
                const DATA = event?.params;
                RET_VAL.push({
                    id: documentId,
                    data: DATA,
                })
            }
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, document, validationRaw });
        logger.error(`${formatValidation.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
};

module.exports = {
    formatValidation,
}
