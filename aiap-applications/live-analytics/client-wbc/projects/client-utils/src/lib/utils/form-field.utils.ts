/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const clearInput = (formField: any) => {
  const text = formField.value.trim().replace(/\n/g, '');
  if (!text) {
    formField.patchValue('');
  }
};
