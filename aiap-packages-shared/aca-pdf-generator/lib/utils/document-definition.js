/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { DOC_DEFINITION_CONSTANTS } = require('./doc-definition-constants');

const addStyles = (styles, document) => {
  if (
    !lodash.isEmpty(styles) &&
    lodash.isObject(styles)
  ) {
    document[DOC_DEFINITION_CONSTANTS.STYLES] = styles;
  }
  return document;
};

const addContent = (content, document) => {
  if (
    !lodash.isEmpty(content) &&
    lodash.isArray(content)
  ) {
    document[DOC_DEFINITION_CONSTANTS.CONTENT] = content;
  }
  return document;
};

const addDefaultStyle = (defaultStyle, document) => {
  if (
    !lodash.isEmpty(defaultStyle) &&
    lodash.isObject(defaultStyle)
  ) {
    document[DOC_DEFINITION_CONSTANTS.DEFAULT_STYLE] = defaultStyle;
  }
  return document;
};

const addContentText = (text, style, document) => {
  let block = {};
  if (!lodash.isEmpty(text)) {
    block[DOC_DEFINITION_CONSTANTS.TEXT] = text;
  }
  if (!lodash.isEmpty(style)) {
    block[DOC_DEFINITION_CONSTANTS.STYLE] = style;
  }
  document[DOC_DEFINITION_CONSTANTS.CONTENT].push(block);
  return document;
};

const addContentTable = (table, style, document) => {
  let block = {};

  if (
    !lodash.isEmpty(table) &&
    !lodash.isArray(table)
  ) {
    block[DOC_DEFINITION_CONSTANTS.TABLE] = table;
  }
  if (!lodash.isEmpty(style)) {
    block[DOC_DEFINITION_CONSTANTS.STYLE] = style;
  }
  document[DOC_DEFINITION_CONSTANTS.CONTENT].push(block);
  return document;
};

const addContentImage = (path, document) => {
  let block = {};
  if (!lodash.isEmpty(path)) {
    block[DOC_DEFINITION_CONSTANTS.IMAGE] = path;
  }
  document[DOC_DEFINITION_CONSTANTS.CONTENT].push(block);
  return document;
};

module.exports = {
  addStyles,
  addContent,
  addDefaultStyle,
  addContentText,
  addContentTable,
  addContentImage,
};
