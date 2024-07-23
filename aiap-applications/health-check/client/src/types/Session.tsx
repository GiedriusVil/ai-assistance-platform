/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { VIEW } from "./View";

export type SESSION_PERMISSION = {
  allowedViews: {
    [key: string]: {
      enabled: boolean
    }
  },
  allowedActions: {
    [key: string]: {
      enabled: boolean
    }
  },
};

export enum SESSION_STORAGE {
  SESSION_PERMISSIONS = 'session_permissions',
  SESSION = 'session',
};


export type ACCESS_GROUP = {
  tenants: any,
  views: any,
};
export type APPLICATION = {
  configuration: {
    type: string,
    route: string,
    views: VIEW[]
  },
  enabled: boolean,
  id: string,
  name: string,
  created: any,
  updated: any,
};

export type SESSION = {
  accessGroup: ACCESS_GROUP,
  application: APPLICATION,
  tenant: any,
  tenants: any[],
};
