/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import React, { useEffect, useState } from 'react';
import { ApplicationContext } from './context/ApplicationContext';
// @ts-ignore
import { Theme, useTheme } from 'carbon-components-react';
import loadStyles from './services/HtmlService';
import { CONFIGS } from './types/Configs';
import { getSession } from './services/SessionService';
import { SESSION } from './types/Session';
import { getItem, setItem } from './services/LocalStorageService';
import Routing from './Routing';

function App({ path, host }: CONFIGS) {
  const { theme: currentTheme } = useTheme();

  const [session, setSession] = useState<SESSION | undefined>(undefined);
  const [theme, setTheme] = useState(currentTheme);

  const changeTheme = (theme: string) => {
    setTheme(theme);
    setItem('theme', theme);
  };

  useEffect(() => {
    const fetchedSession: SESSION = getSession();
    setSession(fetchedSession);
    const fetchedTheme: string = getItem('theme') ?? currentTheme;
    changeTheme(fetchedTheme);

  }, [currentTheme])

  loadStyles({ host, path });

  if (!session) {
    return <div>Loading</div>
  }

  return (
    <>
      <ApplicationContext.Provider value={{session, changeTheme}}>
        <Theme theme={theme}>
          <Routing />
        </Theme>
      </ApplicationContext.Provider>
    </>
  );
}

export default App;
