/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const TRANSACTIONS_XLS_SCHEMA = [{
  'header': 'Organization',
  'key': 'org',
  'col': 'A',
  'width': 35
},
{
  'header': 'Country',
  'key': 'country',
  'col': 'B',
  'width': 15
},
{
  'header': 'PR ID',
  'key': 'id',
  'col': 'C',
  'width': 35
},
{
  'header': 'USER ID',
  'key': 'userID',
  'col': 'D',
  'width': 35
},
{
  'header': 'UNSPCS Code',
  'key': 'unspcsCode',
  'col': 'E',
  'width': 10
},
{
  'header': 'UNSPCS Code description',
  'key': 'unspcsCodeDescr',
  'col': 'F',
  'width': 15
},
{
  'header': 'PR line item number',
  'key': 'itemNo',
  'col': 'G',
  'width': 15
},
{
  'header': 'Item count',
  'key': 'itemCount',
  'col': 'H',
  'width': 15
},
{
  'header': 'Seller ID',
  'key': 'sellerId',
  'col': 'I',
  'width': 30
},
{
  'header': 'Seller Name',
  'key': 'sellerName',
  'col': 'J',
  'width': 25
},
{
  'header': 'Time of arrival',
  'key': 'arrivalTime',
  'col': 'K',
  'width': 25
},
{
  'header': 'Time of completion',
  'key': 'completionTime',
  'col': 'L',
  'width': 25
},
{
  'header': 'Cycle time',
  'key': 'elapsedTime',
  'col': 'M',
  'width': 20
},
{
  'header': 'PR validations count',
  'key': 'totalValidations',
  'col': 'N',
  'width': 15
},
{
  'header': 'PR iteration',
  'key': 'iterationIndex',
  'col': 'O',
  'width': 15
},
{
  'header': 'Validation result action code',
  'key': 'action',
  'col': 'P',
  'width': 20
},
{
  'header': 'Validation description (message code)',
  'key': 'messageCode',
  'col': 'Q',
  'width': 20
},
];
