/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/


// import {
//   allowIfHasPagesPermissions,
// } from '@ibm-aiap/aiap-user-session-provider';

import * as bucketRouter from './buckets';
import * as bucketChangesRouter from './buckets-changes';

import * as filesRouter from './files';
import * as filesChangesRouter from './files-changes';

import { Router } from 'express';
const routes = Router();

routes.use(
  '/buckets-changes',
  // TODO -> Return permission validation
  // allowIfHasPagesPermissions('ObjectStorageBucketsViewV1'),
  bucketChangesRouter.routes,
);

routes.use(
  '/buckets',
  // TODO -> Return permission validation
  // allowIfHasPagesPermissions('ObjectStorageBucketsViewV1'),
  bucketRouter.routes,
);

routes.use(
  '/files-changes',
  // TODO -> Return permission validation
  // allowIfHasPagesPermissions('ObjectStorageFilesViewV1'),
  filesChangesRouter.routes,
);

routes.use(
  '/files/',
  // TODO -> Return permission validation
  // allowIfHasPagesPermissions('ObjectStorageFilesViewV1'),
  filesRouter.routes,
);

export {
  routes,
}
