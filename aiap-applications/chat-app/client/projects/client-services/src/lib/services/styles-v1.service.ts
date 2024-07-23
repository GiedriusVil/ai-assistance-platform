import { Injectable } from '@angular/core';
import * as ramda from 'ramda'; 
import * as lodash from 'lodash'; 

import {
  EnvironmentServiceV1
} from '.';

@Injectable()
export class StylesServiceV1 {
  constructor(
    private environmentService: EnvironmentServiceV1
  ) {
  }

  applyCustomCss(params: any) {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    const TENANT_ID = ramda.path(['tenantId'], params);
    const TENANT_HASH = ramda.path(['tenantHash'], params);
    const ASSISTANT_ID = ramda.path(['assistantId'], params);
    const ENGAGEMENT_ID = ramda.path(['engagementId'], params);
    const HOST_URL = ENVIRONMENT.hostUrl;
    const CUSTOM_CSS_URL = `${HOST_URL}style/${ENGAGEMENT_ID}/${TENANT_ID}/${TENANT_HASH}/${ASSISTANT_ID}/custom.chat.min.css`;
    return new Promise(resolve => {
      const head = document.head || document.getElementsByTagName('head')[0];
      const links = head.getElementsByTagName('link');

      for (let i = 0; i < links.length; i++) {
        if (links[i]['href'] && links[i]['href'].includes('custom.chat.min.css')) {
          links[i].parentNode.removeChild(links[i]);
        }
      }

      const link = document.createElement('link');
      link['type'] = 'text/css';
      link['href'] = CUSTOM_CSS_URL;
      link['rel'] = 'stylesheet';
      link['media'] = 'all';

      head.appendChild(link);

      setTimeout(() => {
        resolve(true);
      }, 0);
    });
  }
}
