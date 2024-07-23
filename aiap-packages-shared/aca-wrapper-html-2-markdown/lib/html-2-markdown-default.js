/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-wrapper-html-2-markdown-html-2-markdown-default`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const _html2Markdown = require('html-to-mrkdwn');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const html2MarkdownDefault = (html, options) => {
    let retVal;
    try {
        retVal = _html2Markdown(html);
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError();
        logger.error('html2Markdown', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    html2MarkdownDefault,
}
