/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
/* eslint no-console: "off" */
const MODULE_ID = 'vba-policy-engine-controller-performance-summary';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getMemoryStore } from '@ibm-aiap/aiap-memory-store-provider';

const redisStore = getMemoryStore();

const getRequestPerformanceSummary = async (req, res) => {
  const ERRORS = [];
  let response;
  try {
    const keys = await redisStore.paternGet('*');
    const prefix = 'default:123:';
    const PROMISES = [];
    keys.forEach(key => {
      const id = key.split(prefix).filter(Boolean)[0];
      PROMISES.push(redisStore.get(id));
    });
    const keyData = await Promise.all(PROMISES);
    const keyDataDuration = keyData.map(data => data.durationInMilliseconds);
    const summary = {
      requestCount: keyData.length,
      minRequestDurationMilliseconds: Math.min(...keyDataDuration),
      maxRequestDurationMilliseconds: Math.max(...keyDataDuration),
      averageRequestDurationMilliseconds: keyDataDuration.reduce((a, b) => a + b, 0) / keyDataDuration.length,
    };
    response = summary;
  } catch (err) {
    ERRORS.push({
      code: 'SYSTEM_ERROR',
      error: err,
      text: `${err}`
    });
  }

  if (lodash.isEmpty(ERRORS)) {
    logger.info('response:', { response });
    res.status(200).json(response);
  } else {
    logger.info('ERRORS:', { errors: ERRORS });
    res.status(500).json(ERRORS);
  }
}

export {
  getRequestPerformanceSummary,
}
