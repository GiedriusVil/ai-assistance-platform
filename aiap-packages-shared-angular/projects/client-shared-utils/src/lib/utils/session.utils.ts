/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-client-shared-utils-utils-session-utils`;

import * as lodash from 'lodash';

import {
  _errorX,
} from '../loggers';

export function retrieveViewWBCConfigurationFromSession(session: any, component: any) {
  let sessionAppViews: any;
  let sessionAppView: any;
  let retVal: any;
  try {
    sessionAppViews = session?.application?.configuration?.views;
    for (let tmpView of sessionAppViews) {
      if (
        tmpView?.type === 'SINGLE_VIEW' &&
        component === tmpView?.component
      ) {
        sessionAppView = lodash.cloneDeep(tmpView);
      } else if (
        !lodash.isEmpty(tmpView?.views) &&
        lodash.isArray(tmpView?.views)
      ) {
        sessionAppView = tmpView.views.find((childView: any) => {
          let condition =
            component === childView?.component &&
            childView?.type === 'SINGLE_VIEW';
          return condition;
        });
      }
      if (
        !lodash.isEmpty(sessionAppView)
      ) {
        break;
      }
    }
    retVal = sessionAppView?.wbc;
    return retVal;
  } catch (error) {
    _errorX(MODULE_ID, 'retrieveViewWBCConfigurationFromSession', {
      sessionAppViews,
      sessionAppView,
      error,
    });
    throw error;
  }
}
