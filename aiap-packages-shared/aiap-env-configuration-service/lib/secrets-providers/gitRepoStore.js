/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lite-config-secret-providers-git-repo-store';

const { parse } = require('dotenv');
const { execHttpGetRequest } = require('@ibm-aca/aca-wrapper-http');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const getEnvFileFromRepo = async opts => {
  const REQUEST_OPTIONS = {
    url: opts.uri + opts.file,
    headers: {
      Accept: 'application/vnd.github.v3.raw',
      Authorization: `token ${opts.personalToken}`,
    },
    json: false
  };
  const { body } = await execHttpGetRequest({}, REQUEST_OPTIONS);
  return body;
} 

const transformEnv = file => parse(Buffer.from(file));

const getConfigFile = async opts => {
  try {
    const envFile = await getEnvFileFromRepo(opts);
    return transformEnv(envFile);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log(`[ERROR] Failed to retrieve config from GIT REPO: ${error}`);
    throw ACA_ERROR;
  }
}

module.exports = async opts => await getConfigFile(opts);
