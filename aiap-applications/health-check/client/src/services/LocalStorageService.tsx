/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const setItem = (key: string, value: string) => {
  localStorage.setItem(`health-check-${key}`, value);
};

export const getItem = (key: string) => {
  return localStorage.getItem(`health-check-${key}`);
};
