/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const RULES_XLS_SCHEMA = [
  {
    'col': 'A',
    'key': 'id',
    'header': 'Rule Unique ID',
    'width': 32
  },
  {
    'col': 'B',
    'key': 's_action',
    'header': 'Action',
    'width': 15
  },
  {
    'header': 'Rule Name',
    'key': 'name',
    'col': 'C',
    'width': 32
  },
  {
    'header': 'Buyer ID',
    'key': 'buyer',
    'col': 'D',
    'width': 32
  },
  {
    'header': 'Type',
    'key': 'r_type',
    'col': 'E',
    'width': 15
  },
  {
    'header': 'Message To User',
    'key': 'messageId',
    'col': 'F',
    'width': 32
  },
  {
    'header': 'Action',
    'key': 'action',
    'col': 'G',
    'width': 15
  },
  {
    'header': 'Fact',
    'key': 'fact',
    'col': 'H',
    'width': 20
  },
  {
    'header': 'Path',
    'key': 'path',
    'col': 'I',
    'width': 20
  },
  {
    'header': 'Operator',
    'key': 'c_type',
    'col': 'J',
    'width': 15
  },
  {
    'header': 'Value',
    'key': 'value',
    'col': 'K',
    'width': 32
  }
];
