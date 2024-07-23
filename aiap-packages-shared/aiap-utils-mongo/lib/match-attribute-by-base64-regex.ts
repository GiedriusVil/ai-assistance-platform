/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

/** 
* On high level this function finds 3 available base64 encoding patterns applying offset to original word encoding.
* This needs to be done, because You just can't encode word to base64 and search it in long base64 string.
* Depending on context around word, it can appear in 3 different ways in base64 encoding.
* When all patterns are found they are combined in one regex and then search is performed.
* More information about base64 search : https://www.leeholmes.com/searching-for-content-in-base-64-strings/
*
* @example
* // returns (NsYWNr|bGFja|c2xhY2)
* findBase64EncodingsRegex('slack');
* @returns Returns Regex pattern for different encoding patterns that will be used in search.
*/

const findBase64EncodingsRegex = (
  input: any,
) => {
  const RET_VAL = [];
  const BUFFER = Buffer.from(input);
  const ENCODING_OFFSET_0 = BUFFER.toString('base64');
  const ENCODING_OFFSET_1 = Buffer
    .concat(
      [
        Buffer.alloc(1),
        BUFFER
      ]
    ).toString('base64')
    .substring(2);

  const ENCODING_OFFSET_2 = Buffer
    .concat(
      [
        Buffer.alloc(2),
        BUFFER
      ]
    ).toString('base64')
    .substring(4);

  RET_VAL.push(ENCODING_OFFSET_0, ENCODING_OFFSET_1, ENCODING_OFFSET_2);
  const REPLACE_OFFSET_SYMBOLS = RET_VAL.map((offset) => offset.replace(/.==?$/, ''));
  const REGEX = `(${REPLACE_OFFSET_SYMBOLS.sort().join('|')})`;
  return REGEX;
};

const matchAttributeByBase64Regex = (
  attribute: string,
  input: any,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(attribute) &&
    lodash.isString(input)
  ) {
    const BASE64_REGEX = findBase64EncodingsRegex(input);
    RET_VAL[attribute] = {
      $regex: BASE64_REGEX,
      $options: 'i'
    };
  }
  return RET_VAL;
}

export {
  matchAttributeByBase64Regex,
}
