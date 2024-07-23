/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-service-rules-messages-save-one';
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
        const DOC = ramda.path(['doc'], params);
        const DOC_CHANGES = ramda.path(['docChanges'], params);

        if (lodash.isEmpty(context)) {
            const MESSSAGE = 'Missing mandatory context parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
        }
        if (lodash.isEmpty(ACTION)) {
            const MESSSAGE = 'Missing mandatory params.action parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
        }
        if (lodash.isEmpty(DOC_TYPE)) {
            const MESSSAGE = 'Missing mandatory params.docType parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
        }
        if (lodash.isEmpty(DOC_ID)) {
            const MESSSAGE = 'Missing mandatory params.docId parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
        }
        if (lodash.isEmpty(DOC)) {
            const MESSSAGE = 'Missing mandatory params.doc parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSSAGE);
        }

        const RECORD = new AuditRecord.builder(DOC_TYPE)
            .byContext(context)
            .onAction(ACTION)
            .withDocId(DOC_ID)
            .withDoc(DOC)
            .withDocChanges(DOC_CHANGES)
            .build();

        const DATASOURCE = getDatasourceByContext(context);
        await DATASOURCE.rulesMessages.saveOne(context, { record: RECORD });
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        // throw ACA_ERROR; -> For now lets swallow this exception!
    }
}

module.exports = {
    saveOne,
}
