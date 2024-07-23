/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-wrapper-html-2-markdown-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { HTML_2_MARKDOWN_TYPES } = require('./lib/html-2-markdown-types');

const { html2MarkdownDefault } = require('./lib/html-2-markdown-default');
const { html2MarkdownCustom } = require('./lib/html-2-markdown-custom');

const html2Markdown = (html, options = {}) => {
  const TYPE = ramda.path(['type'], options);
  let retVal;
  try {
    switch (TYPE) {
      case HTML_2_MARKDOWN_TYPES.CUSTOM:
        retVal = html2MarkdownCustom(html);
        break;
      default:
        retVal = html2MarkdownDefault(html);
        break;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { html, options });
    logger.error('html2Markdown', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  html2Markdown,
}
