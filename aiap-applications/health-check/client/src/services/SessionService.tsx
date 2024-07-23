/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { SESSION, SESSION_PERMISSION, SESSION_STORAGE } from "../types/Session";

export const isActionAllowed = (action: string) => {
  const SESSION_PERMISSIONS: SESSION_PERMISSION = getSessionPermissions();
  const VIEWS = SESSION_PERMISSIONS.allowedViews;

  const RET_VAL = VIEWS[action]?.enabled;
  return RET_VAL;
};

export const isViewAllowed = (view: string) => {
  const SESSION_PERMISSIONS: SESSION_PERMISSION = getSessionPermissions();
  const VIEWS = SESSION_PERMISSIONS.allowedViews;

  const RET_VAL = VIEWS[view]?.enabled;
  return RET_VAL;
};


export const getSessionPermissions = () => {
  const SESSION_PERMISSIONS = sessionStorage[SESSION_STORAGE.SESSION_PERMISSIONS];
  const RET_VAL: SESSION_PERMISSION = JSON.parse(SESSION_PERMISSIONS);
  return RET_VAL;
};


export const getSession = () => {
  const SESSION_PERMISSIONS = sessionStorage[SESSION_STORAGE.SESSION];
  const RET_VAL: SESSION = JSON.parse(SESSION_PERMISSIONS);
  return RET_VAL;
};
