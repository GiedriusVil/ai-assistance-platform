/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface User {
  id: string;
  username: string;
  password: string;
  accessGroups: [];
  timezone: string;
  updated: string;
  created: string;
  lastLogin: string;
  userStatus: string;
};
