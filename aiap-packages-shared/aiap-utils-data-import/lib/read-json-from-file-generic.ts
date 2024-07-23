/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  readJsonFromFileJson,
} from './read-json-from-file-json';

import {
  readJsonFromFileXls,
} from './read-json-from-file-xls';

export const readJsonFromGenericFile = async (
  file: {
    mimetype: any,
    path: any,
  },
) => {
  let retVal;
  const FILE_MIME_TYPE = file?.mimetype;
  switch (FILE_MIME_TYPE) {
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      retVal = await readJsonFromFileXls(file);
      break;
    case 'application/json':
      retVal = readJsonFromFileJson(file);
      break;
    default:
      throw new Error(`File mime type is not supported! ${FILE_MIME_TYPE}`);
  }
  return retVal;
}
