/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Dropdown } from "carbon-components-react";
import { useContext } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
// @ts-ignore
import { useTheme } from 'carbon-components-react';

const themeOptions = ['white', 'g100', 'g90', 'g10'];

const Settings = () => {
  const { theme } = useTheme();
  const { changeTheme }: any = useContext(ApplicationContext);
  return <>
    <Dropdown
      id="themeSelection"
      titleText="Theme"
      label="Select a theme"
      selectedItem={theme}
      onChange={({ selectedItem }) => changeTheme(selectedItem)}
      items={themeOptions}
    />
  </>
};

export default Settings;
