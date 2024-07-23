/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from "client-utils";

@Injectable()
export class HostPageInfoService {

  static getClassName() {
    return 'HostPageInfoService';
  }

  constructor() { }

  getInfo(params) {
    const ACA_WIDGET_OPTIONS = ramda.path(['acaWidgetOptions'], window);
    const RET_VAL = {
      href: window.top.location.href,
      lang: undefined,
      tenantId: undefined,
      assistantId: undefined,
      engagementId: undefined
    };
    if (
      document &&
      document.documentElement &&
      document.documentElement.lang &&
      !lodash.isEmpty(ACA_WIDGET_OPTIONS)
    ) {
      RET_VAL.lang = document.documentElement.lang;
      RET_VAL.tenantId = ramda.path(['tenantId'], ACA_WIDGET_OPTIONS);
      RET_VAL.assistantId = ramda.path(['assistantId'], ACA_WIDGET_OPTIONS);
      RET_VAL.engagementId = ramda.path(['engagementId'], ACA_WIDGET_OPTIONS);

      const dataItemReqs = params.dataItemReqs;
      if (
        dataItemReqs &&
        dataItemReqs.length > 0
      ) {
        for (let index = 0; index < dataItemReqs.length; index++) {
          let dataItemReq = dataItemReqs[index];
          if (
            dataItemReq &&
            dataItemReq.sourceKey &&
            dataItemReq.targetKey &&
            dataItemReq.type
          ) {
            try {
              switch (dataItemReq.type) {
                case 'string':
                  RET_VAL[dataItemReq.targetKey] = window.localStorage.getItem(dataItemReq.sourceKey);
                  break;
                case 'json':
                  RET_VAL[dataItemReq.targetKey] = JSON.parse(window.localStorage.getItem(dataItemReq.sourceKey));
                  break;
                default:
                  break;
              }
            } catch (error) {
              _debugX(HostPageInfoService.getClassName(), '[ERROR] Failed to retrieve data item.', { error, dataItemReq });
            }
          }
        }
      }
    }
    _debugX(HostPageInfoService.getClassName(), 'Info', { RET_VAL });
    return RET_VAL;
  }

}
