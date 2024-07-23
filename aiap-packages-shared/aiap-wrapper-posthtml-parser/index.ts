/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import parser from 'posthtml-parser';

const PARSE_OPTIONS = {
  xmlMode: true,
  recognizeSelfClosing: true,
  normalizeWhitespace: false,
  decodeEntities: false,
};

const parseToTree = (string: string, options = PARSE_OPTIONS) => {
  return parser(string, options);
}

export {
  parseToTree,
}
