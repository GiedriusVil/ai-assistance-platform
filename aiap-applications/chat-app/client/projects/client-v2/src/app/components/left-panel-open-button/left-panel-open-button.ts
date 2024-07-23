/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';

import {
  ChatWidgetServiceV1,
  SessionServiceV2,
  LeftPanelServiceV1
} from 'client-services';

import * as ramda from 'ramda';

@Component({
  selector: 'aiap-left-panel-open-button',
  templateUrl: './left-panel-open-button.html',
  styleUrls: ['./left-panel-open-button.scss']
})
export class LeftPanelOpenButton implements OnInit {

  constructor(
    private leftPanelService: LeftPanelServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private sessionService: SessionServiceV2,
  ) {

  }

  icons: any = {};

  ngOnInit(): void {
    this.getIcons();
  }

  getIcons() {
    this.icons['upArrow'] = this.getIcon('chevron--up.svg', 'upArrow');
  }

  isButtonVisible() {
    const RET_VAL = this.leftPanelService.isButtonVisible();
    return RET_VAL;
  }

  isLeftPanelVisible() {
    const RET_VAL = this.leftPanelService.isLeftPanelVisible();
    return RET_VAL;
  }

  toggleLeftPanel() {
    this.isLeftPanelVisible()
      ? this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.LEFT_PANEL_CLOSE, true)
      : this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.LEFT_PANEL_OPEN, true);
  }

  getIcon(fileName, propertyName) {
    const CHAT_ASSETS_URL = this.chatWidgetService.getChatAppHostUrl() + '/en-US/assets';
    const FILE_NAME = ramda.pathOr(fileName,
      ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'leftPanel', propertyName, 'fileName'],
      this.sessionService.getSession());
    return `${CHAT_ASSETS_URL}/${FILE_NAME}`;
  }
}
