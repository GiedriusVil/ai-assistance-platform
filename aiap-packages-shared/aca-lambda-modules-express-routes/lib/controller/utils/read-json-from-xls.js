/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-utils-read-xls'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const node_xj = require('xls-to-json');

const SHEET_NAME = 'TRANSACTION ROUTING';

/** When excel has empty spaces, then xls-to-json can produce blank row as { "key": "", "value": "" } */
// const _clearEmptyRows = (rows) => {
//   const RET_VAL = [];
//   for (let index = 0; index < rows.length; index++) {
//     const ROW = rows[index];
//     if (
//       ROW &&
//       ROW.key.length > 0 &&
//       ROW.value.length > 0
//     ) {
//       RET_VAL.push(ROW);
//     }
//   }
//   return RET_VAL;
// }

const readJsonFromXls = (file) => {
  const FILE_PATH = ramda.path(['path'], file);
  const RET_VAL = new Promise((resolve, reject) => {
    const XLS_TO_JSON_CONFIG = {
      input: FILE_PATH,
      output: null, // output json
      sheet: SHEET_NAME,
      rowsToSkip: 0,
      allowEmptyKey: false,
    };
    const xlsToJsonCallBack = (err, result) => {
      logger.info('After lib parsing, result is: ', result);
      if (err) {
        reject(err);
      } else if (result.length == 0) {
        reject(`Unable to find sheet ${SHEET_NAME}`);
      } else {
        // const RET_VAL = _clearEmptyRows(result);
        resolve(result);
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
