/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { createContext } from 'react';

export const ApplicationContext: any = createContext({
  session: {},
  changeTheme: () => {}
});
