/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const fs = require('fs');
const os = require('os');
const path = require('path');

const createBoxRefreshToken = (name, data) => {
    const TMP_BOX_TOKENS = path.join(os.tmpdir(), `${name}.json`);
    fs.writeFileSync(TMP_BOX_TOKENS, data);
}

const returnBoxAccessToken = (name) => {
    const TMP_BOX_TOKENS = path.join(os.tmpdir(), `${name}.json`);
    const ACCESS_TOKEN_FILE = fs.readFileSync(TMP_BOX_TOKENS, {encoding:'utf8', flag:'r'});
    return ACCESS_TOKEN_FILE;
}

const checkBoxFile = (name) => {
  const TMP_BOX_TOKENS = path.join(os.tmpdir(), `${name}.json`);
  const ACCESS_TOKEN_FILE = fs.existsSync(TMP_BOX_TOKENS);
  return ACCESS_TOKEN_FILE;
}

module.exports = {
    createBoxRefreshToken,
    returnBoxAccessToken,
    checkBoxFile
}
