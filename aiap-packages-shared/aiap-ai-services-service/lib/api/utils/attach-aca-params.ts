/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const attachACAParams = (
  skill: {
    name: any,
    aca: any,
  },
) => {
  if (
    skill
  ) {
    const ACTION_DATE = new Date();
    const DATE_IN_MS = ACTION_DATE.valueOf();
    skill.aca = {
      name: skill?.name,
      created: ACTION_DATE,
      createdT: DATE_IN_MS,
      deployed: ACTION_DATE,
      deployedT: DATE_IN_MS
    }
  }
}

