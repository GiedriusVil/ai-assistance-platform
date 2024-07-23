/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';
import { _debugX } from 'client-utils';

import * as lodash from 'lodash';

@Component({
  selector: 'aca-wbc-table',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {

  static getElementTag() {
    return 'aca-wbc-table';
  }

  title = 'aca-wbc-table';

  @Input() message: any;
  @Input() isContentEnabled: any;

  @Output() onWbcEvent = new EventEmitter<any>();

  _state = {
    columns: [],
    rows: [],
    rowsCount: 0,
    pagination: {
      page: 1,
      size: 5,
    },
    attributes: [],
    content: {
      textLimit: 40,
      enabled: true
    },
  }

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) { }

  ngOnInit(): void {
    this.loadHTMLDependencies();
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.refresh();
  }

  hasText() {
    let retVal = false;
    if (!lodash.isEmpty(this.message?.text)) {
      retVal = true;
    }
    return retVal;
  }

  handleRowClick(row: any): void {
    if (!this._state.content.enabled) {
      return;
    }
    const TEXT = row?.payload;
    const MESSAGE: any = {
      type: 'user',
      text: TEXT,
      sender_action: {
        type: 'item_selected',
        data: row,
      },
      timestamp: new Date().getTime()
    }
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    _debugX(AppComponent.getElementTag(), 'handleRowClick', {
      this_state: this._state,
      event: EVENT
    });
    this.onWbcEvent.emit(EVENT);
  }

  onButtonClick(message: any) {
    if (!this._state.content.enabled) {
      return;
    }
    const MESSAGE: any = {
      type: 'user',
      text: message,
      timestamp: new Date().getTime()
    }
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    _debugX(AppComponent.getElementTag(), 'handleRowClick', {
      this_state: this._state,
      event: EVENT
    });
    this.onWbcEvent.emit(EVENT);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  showTooltip(text: string): boolean {
    return this._state.content.textLimit >= text?.length;
  }

  refresh(): void {
    this._state.columns = this.message?.attachment?.columns;
    this._state.rows = this.message?.attachment?.rows
      .map((item: any, index: number) => ({ id: index + 1, ...item }))
      .slice((this._state.pagination.page - 1) * this._state.pagination.size, (this._state.pagination.page - 1) * this._state.pagination.size + this._state.pagination.size);
    this._state.rowsCount = this.message?.attachment?.rows.length;
    this._state.attributes = this.message?.attachment?.attributes;
    const EVENT = {
      type: 'REFRESHED'
    }

    console.log(`[ACA] [DEBUB] [ ${AppComponent.getElementTag()}] refresh`, {
      this_state: this._state
    });
    this.onWbcEvent.emit(EVENT);
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
