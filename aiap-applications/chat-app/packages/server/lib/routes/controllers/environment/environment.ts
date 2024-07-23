/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('environment-controller');

import moment from 'moment';

import {
  TokenService
} from '../../../common/token/tokenService';

const _submitEnvironment = async (record) => {};

const submitEnvironment = async (req, res) => {
  try {
    const conversationToken = new TokenService({}).verify(req.body.conversationToken);
    const timestamp = moment(new Date())
    .utc()
    .toISOString();
    
    const record = {
      id: conversationToken.externalConversationId,
      hostname: req.body?.environment?.hostname,
      size: req.body?.environment?.size,
      language: req.body?.environment?.language,
      name: req.body?.environment?.name,
      version: req.body?.environment?.version,
      os: req.body?.environment?.os,
      type: req.body?.environment?.type,
      timestamp: timestamp,
    };
    
    await _submitEnvironment(record);
    return res.status(200).json({});
  } catch (error) {
    logger.error('[Error] Environment jwt.verify failed', error);
    res.status(500).json({});
  }
};

export default {
  submitEnvironment,
};
