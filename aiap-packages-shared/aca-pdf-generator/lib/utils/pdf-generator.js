/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-pdf-generator';

const {
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

// const PdfPrinter = require('pdfmake');

const { FONTS } = require('../configuration/fonts/fonts');

const createPDF = (documentDefinition) => {
  // return new Promise((resolve, reject) => {
  //   try {
  //     const PRINTER = new PdfPrinter(FONTS);
  //     const DOC = PRINTER.createPdfKitDocument(documentDefinition);
  //     const CHUNKS = [];

  //     DOC.on('data', (chunk) => {
  //       CHUNKS.push(chunk);
  //     });

  //     DOC.on('end', () => {
  //       const RESULT = Buffer.concat(CHUNKS);
  //       resolve(RESULT);
  //     });
  //     DOC.end();
  //     DOC.on('error', (error) => {
  //       reject(error);
  //     });
  //   } catch (error) {
  //     _throwError(error, createPDF.name);
  //   }
  // });
};

const createDocumentDefinition = () => {
  return {
    content: [],
    styles: {},
    defaultStyle: {},
  };
};

const _throwError = (error, functionName) => {
  const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
  appendDataToError(ACA_ERROR, { functionName });
  logger.error({ ACA_ERROR });
  throw ACA_ERROR;
};

module.exports = {
  createPDF,
  createDocumentDefinition,
};
