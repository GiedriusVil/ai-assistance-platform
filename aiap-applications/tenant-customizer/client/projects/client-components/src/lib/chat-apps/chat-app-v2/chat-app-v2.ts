/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import { NotificationServiceV2 } from 'client-shared-services';

@Component({
  selector: 'aca-widget-chat-app-v2',
  templateUrl: './chat-app-v2.html',
  styleUrls: ['./chat-app-v2.scss'],
})
export class ChatAppV2 implements OnInit, OnChanges {

  static getClassName() {
    return 'ChatAppV2Comp';
  }

  @Input() credentials: any;

  constructor(
    private notificationService: NotificationServiceV2,
  ) { }

  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges) {
    _debugX(ChatAppV2.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_credentials: this.credentials,
    });

    this.loadAllVAScripts(this.credentials);
  }

  async loadAllVAScripts(credentials: any) {
    const HOSTNAME = credentials?.hostname;
    const LANGUAGE = credentials?.language;
    const TENANT_ID = credentials?.tenantId;
    const ENGAGEMENT_ID = credentials?.engagementId;
    const ASSISTANT_ID = credentials?.assistantId;
    _debugX(ChatAppV2.getClassName(), 'loadAllVAScripts', { HOSTNAME, TENANT_ID, ENGAGEMENT_ID, ASSISTANT_ID });
    const CUSTOM_SRC = `${HOSTNAME}/wbc-chat-app/static/${ENGAGEMENT_ID}/custom.widget.min.js?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&language=${LANGUAGE}`;
    const WIDGET_SRC = `${HOSTNAME}/wbc-widget.min.js`
    const DEFAULT_SRC = `${HOSTNAME}/default.min.js`;
    _debugX(ChatAppV2.getClassName(), 'loadAllVAScripts', { CUSTOM_SRC, WIDGET_SRC, DEFAULT_SRC });
    const ON_CUSTOM_LOAD = async () => {
      await this.loadScript(WIDGET_SRC);
    }
    const ON_DEFAULT_LOAD = async () => {
      await this.loadScript(CUSTOM_SRC, ON_CUSTOM_LOAD);
    }
    await this.loadScript(DEFAULT_SRC, ON_DEFAULT_LOAD);
    return true;
  }

  async loadScript(name: string, onLoad?: any) {
    const script = document.createElement('script');
    script.src = name;
    document.body.appendChild(script);
    if (
      onLoad
    ) {
      script.onload = () => {
        onLoad()
      };
    } else {
      script.onload = () => {
        console.log('chat_loaded');
      };
    }
    script.onerror = () => {
      throw new Error('Failed to load Virtual Agent scripts, please try again later...');
    };
  }

}
