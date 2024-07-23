/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const node_xj = require('xls-to-json');

/** When excel has empty spaces, then xls-to-json can produce blank row as { "key": "", "value": "" } */
const _clearEmptyRows = (rows) => {
  const RET_VAL = [];
  for (let index = 0; index < rows.length; index++) {
    const ROW = rows[index];
    if (
      ROW &&
      ROW.key.length > 0 &&
      ROW.value.length > 0
    ) {
      RET_VAL.push(ROW);
    }
  }
  return RET_VAL;
}

const readJsonFromXls = (file) => {
  const FILE_PATH = ramda.path(['path'], file);
  const RET_VAL = new Promise((resolve, reject) => {
    const XLS_TO_JSON_CONFIG = {
      input: FILE_PATH, // input xls
      output: null, // output json
      sheet: 'answers', // specific sheetname
      rowsToSkip: 0, // number of rows to skip at the top of the sheet; defaults to 0
      allowEmptyKey: false, // avoids empty keys in the output, example: {"": "something"}; default: true
    };
    const xlsToJsonCallBack = (err, result) => {
      if (err) {
        reject(err);
      } else if (result.length == 0) {
        reject(`Unable to find sheet 'answers'`);
      } else {
        const RET_VAL = _clearEmptyRows(result);
        resolve(RET_VAL);
      }
    }
    node_xj(
      XLS_TO_JSON_CONFIG,
      xlsToJsonCallBack
    );

  });

  return RET_VAL;
}


module.exports = {
  readJsonFromXls
};
