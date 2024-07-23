/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface User {
  _id: string;
  username: string;
  password: string;
  actions: string[];
  created: string;
  lastLogin: string;
  accessGroups: [];
  pages: string[];
  role: string;
  roleTitle: string;
  timezone: string;
  updated: string;
};
