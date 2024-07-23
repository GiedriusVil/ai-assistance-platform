/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {
  IChangesV1
} from '../../changes';

import {
  IContextV1
} from '../../context';

import {
  IEngagementV1
} from '../engagements';

export interface IEngagementChangeV1 extends IChangesV1<IEngagementV1> {
  context?: IContextV1,
  created?: {
    user?: {
      id: string,
      name: string
    },
    date?: Date,
  },
  updated?: {
    user?: {
      id: string,
      name: string
    },
    date?: Date,
  }
}
