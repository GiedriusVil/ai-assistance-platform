/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  addStyles,
  addContent,
  addDefaultStyle,
  addContentText,
  addContentTable,
  addContentImage,
} = require('./lib/utils/document-definition.js');

const {
  createDocumentDefinition,
  createPDF,
} = require('./lib/utils/pdf-generator.js');

module.exports = {
  createPDF,
  createDocumentDefinition,
  addStyles,
  addContent,
  addDefaultStyle,
  addContentText,
  addContentTable,
  addContentImage,
};
