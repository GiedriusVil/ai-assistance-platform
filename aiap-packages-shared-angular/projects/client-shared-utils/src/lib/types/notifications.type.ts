/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export enum NOTIFICATION_STATUS {
  ERROR = 'ERROR',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}

export interface INotification {
  title?: string;
  subtitle?: string;
  show?: boolean;
  autoClose?: boolean;
  caption?: string;
  status?: NOTIFICATION_STATUS;
}
