/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import {
  ChatWidgetServiceV1,
  HTMLDependenciesServiceV1,
} from 'client-services';

import * as lodash from 'lodash';
import { SENDER_ACTION_TYPES } from './constants';
import { Dropdown, Item, Params, Metadata } from './types';

@Component({
  selector: 'aca-wbc-dropdown-options',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static getClassName() {
    return 'AppComponent';
  }

  static getElementTag() {
    return 'aca-wbc-dropdown-options';
  }

  title = 'aca-wbc-dropdown-options';

  @Input() message: Params;
  @Output() onWbcEvent = new EventEmitter<any>();

  opened: any = {};

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) { }

  ngOnInit() {
    this.loadHTMLDependencies();
  }

  postMessage(text: string, metadata: Metadata) {
    const MESSAGE: any = {
      type: 'user',
      text: text,
      timestamp: new Date().getTime(),
      sender_action: {
        type: SENDER_ACTION_TYPES.ON_ITEM_SELECTED,
        data: metadata,
      },
    };
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE,
    };
    this.onWbcEvent.emit(EVENT);
  }

  selectOption(item: Item, dropdown: Dropdown) {
    const METADATA = this.mergeMetadataObjects(item.metadata, dropdown.metadata);
    this.postMessage(item.text, METADATA);
  }

  mergeMetadataObjects(itemMetadata: Metadata, dropdownMetadata: Metadata) {
    const METADATA = lodash.cloneDeep(this.message.metadata);
    const RET_VAL = lodash.merge(METADATA, dropdownMetadata, itemMetadata);
    return RET_VAL;
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
  }

}
