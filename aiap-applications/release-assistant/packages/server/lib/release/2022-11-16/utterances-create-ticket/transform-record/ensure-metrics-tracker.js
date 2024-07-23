/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-11-16-utterances-create-ticket-transform-record-ensure-metrics-tracker';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const CREATE_TICKET_INSTANCE_NAMES = {
  POP: 'application',
  PSIS: 'invoice'
};

const INSTANCES = {
  POP: 'pop',
  PSIS: 'psis'
};

const getTicketInstance = (utterance) => {
  const PROBLEM_TYPE = utterance?.context?.problemType;
  let instance = null;
  if (!lodash.isEmpty(PROBLEM_TYPE)) {
    for (let name in CREATE_TICKET_INSTANCE_NAMES) {
      const IS_NAME_MATHED = PROBLEM_TYPE.includes(CREATE_TICKET_INSTANCE_NAMES[name]);
      if (IS_NAME_MATHED) {
        instance = INSTANCES[name];
      }
    }
  }
  return instance;
}

const ensureMetricsTracker = (utterance) => {
  try {

    metricsTracker = utterance?.metricsTracker;

    if (
      lodash.isEmpty(metricsTracker)
    ) {
      const instanceName = getTicketInstance(utterance);
      if (
        !lodash.isEmpty(instanceName)
      ) {
        metricsTracker = {
          createTicket: {
            instanceName: instanceName
          }
        };
      } else {
        metricsTracker = null;
      }

    }

    utterance.metricsTracker = metricsTracker;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureMetricsTracker.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureMetricsTracker,
}
