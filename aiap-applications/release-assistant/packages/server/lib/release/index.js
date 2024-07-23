/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('aca-release-assistant');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const release = async (version, config) => {
  logger.info(`Initiated release or version: ${version}`);
  if (lodash.isEmpty(version)) {
    throw new Error('Please provider release ticket number!');
  }
  const release = require(`./${version}`);
  await release.execute(config);

  logger.info(`Executed ${version}!`);
}

module.exports = {
  release,
}
