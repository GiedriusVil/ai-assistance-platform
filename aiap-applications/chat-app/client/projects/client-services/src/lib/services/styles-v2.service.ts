import { Injectable } from '@angular/core';
import * as ramda from 'ramda';
import * as lodash from 'lodash';

@Injectable()
export class StylesServiceV2 {
  static getWbcId() {
    return 'aca-wbc-chat-app';
  }
  applyCustomCss(params: any) {

    const TENANT_ID = ramda.path(['tenantId'], params);
    const TENANT_HASH = ramda.path(['tenantHash'], params);
    const ASSISTANT_ID = ramda.path(['assistantId'], params);
    const ENGAGEMENT_ID = ramda.path(['engagementId'], params);
    const HOST_URL = ramda.path(['chatAppHostUrl'], params);
    const CUSTOM_CSS_URL = `${HOST_URL}/style/${ENGAGEMENT_ID}/${TENANT_ID}/${TENANT_HASH}/${ASSISTANT_ID}/custom.chat.min.css`;
    return new Promise(resolve => {
      const WBC_ID = StylesServiceV2.getWbcId();
      const LINK_EL = document.getElementById(WBC_ID);
      if (lodash.isElement(LINK_EL)) {
        LINK_EL.remove();
      }

      const SHADOW_DOM = document.querySelector('aca-chat-app');
      //.shadowRoot;
      const WBC_STYLE_HREF = CUSTOM_CSS_URL;
      const WBC_STYLE_EL = document.createElement('link');
      WBC_STYLE_EL.id = WBC_ID;
      WBC_STYLE_EL.rel = 'stylesheet';
      WBC_STYLE_EL.href = WBC_STYLE_HREF;

      SHADOW_DOM.before(WBC_STYLE_EL);
    });
  }
}
