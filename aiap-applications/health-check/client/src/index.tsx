/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reactToWebcomponent from 'react-to-webcomponent';

// @ts-ignore
const webComponent: any = reactToWebcomponent(App, React, ReactDOM, { dashStyleAttriutes: true });
customElements.define('health-check', webComponent)
