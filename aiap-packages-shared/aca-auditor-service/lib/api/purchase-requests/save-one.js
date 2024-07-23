/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-service-purchase-requests-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { AuditRecord } = require('../../utils/audit-record-utils');

const saveOne = async (context, params) => {
    try {
        const ACTION = ramda.path(['action'], params);
        const DOC_TYPE = ramda.path(['docType'], params);
        const DOC_ID = ramda.path(['docId'], params);
        const DOC_EXT_ID = ramda.path(['docExtId'], params);
        const DOC = ramda.path(['doc'], params);

        if (lodash.isEmpty(context)) {
            const MESSAGE = 'Missing mandatory context parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (lodash.isEmpty(ACTION)) {
            const MESSAGE = 'Missing mandatory params.action parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (lodash.isEmpty(DOC_TYPE)) {
            const MESSAGE = 'Missing mandatory params.docType parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (lodash.isEmpty(DOC_EXT_ID)) {
            const MESSAGE = 'Missing mandatory params.docExtId parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (lodash.isEmpty(DOC)) {
            const MESSAGE = 'Missing mandatory params.doc parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        const RECORD = new AuditRecord.builder(DOC_TYPE)
            .byContext(context)
            .onAction(ACTION)
            .withDocExtId(DOC_EXT_ID)
            .withDocId(DOC_ID)
            .withDoc(DOC)
            .build();

        const DATASOURCE = getDatasourceByContext(context);
        await DATASOURCE.purchaseRequests.saveOne(context, { record: RECORD });
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        // throw ACA_ERROR; -> For now lets swallow this exception!
    }
}

module.exports = {
    saveOne,
}
