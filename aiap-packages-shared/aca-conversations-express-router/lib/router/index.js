/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const {
  appendAcaContextToRequest,
} = require(`@ibm-aiap/aiap-utils-express-routes`);

const router = express.Router();

const { conversationsRouter } = require('./conversations');
const { utterancesRouter } = require('./utterances');
const { transcriptsRouter } = require('./transcripts');
const { surveysRouter } = require('./surveys');
const { feedbacksRouter } = require('./feedbacks');

router.use(
  '/conversations',
  allowIfHasPagesPermissions('ConversationsViewV1'),
  appendAcaContextToRequest,
  conversationsRouter
);
router.use(
  '/transcripts',
  allowIfHasPagesPermissions('TranscriptViewV1'),
  transcriptsRouter
);
router.use(
  '/utterance',
  allowIfHasPagesPermissions('UtterancesViewV1'),
  appendAcaContextToRequest,
  utterancesRouter
);
router.use(
  '/surveys',
  allowIfHasPagesPermissions('SurveysViewV1'),
  appendAcaContextToRequest,
  surveysRouter
);
router.use(
  '/feedbacks',
  allowIfHasPagesPermissions('FeedbacksViewV1'),
  feedbacksRouter
);

module.exports = {
  router,
}
