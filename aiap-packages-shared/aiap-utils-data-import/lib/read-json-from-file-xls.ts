/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const node_xj = require('xls-to-json');

export const readJsonFromFileXls = (
  file: {
    path: any,
  },
) => {
  const FILE_PATH = file?.path;
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
