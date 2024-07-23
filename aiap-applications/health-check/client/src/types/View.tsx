/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export enum VIEW_TYPE {
  SINGLE_VIEW = 'SINGLE_VIEW',
  MULTI_VIEW = 'MULTI_VIEW'
};

export type ACTION = {
  name: string,
  component: string,
  description: string,
};

export type VIEW_SINGLE = {
  type: VIEW_TYPE.SINGLE_VIEW,
  component: string,
  name: string,
  icon?: string,
  path: string,
  description: string,
  actions: ACTION[]
};

export type VIEW_MULTI = {
  type: VIEW_TYPE.MULTI_VIEW,
  name: string,
  icon?: string,
  views: VIEW_SINGLE[]
};

export type VIEW = VIEW_SINGLE | VIEW_MULTI;
