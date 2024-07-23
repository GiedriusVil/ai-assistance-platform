/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const prefix = 'ACA:';

export const getIntent = (
  update: any,
) => {
  const session = update.session;
  let intent;

  if (
    session.lastContext &&
    session.lastContext.journeyIntent
  ) {
    intent = `${prefix} ${session.lastContext.journeyIntent}`;
  } else if (
    session.wva &&
    session.wva.intents &&
    session.wva.intents.length > 0
  ) {
    intent = `${prefix} ${session.wva.intents[0].intent}`;
  } else {
    intent = `${prefix} Not-Specified`;
  }
  return intent;
}
