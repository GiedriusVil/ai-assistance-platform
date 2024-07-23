/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CONFIGS } from "../types/Configs";

const loadStyles = ({ host, path }: CONFIGS) => {

  if (!host || !path) {
    return;
  }

  const STYLES = document.getElementById("my-react-component-styles");

  if (!STYLES) {
    const LINK = document.createElement('link')
    LINK.rel = 'stylesheet';
    LINK.id = 'my-react-component-styles';
    LINK.href = host + path.replace('.js', '.css');

    document.body.appendChild(LINK);
  }
};

export default loadStyles;
