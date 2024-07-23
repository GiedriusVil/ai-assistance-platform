/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aca-chat-table-attachment',
  templateUrl: './table.attachment.html',
  styleUrls: ['./table.attachment.scss']
})
export class TableAttachment implements OnInit {

  @Input() message: any;
  @Input() isContentEnabled: boolean;

  @Output() userActionEvent = new EventEmitter<any>();

  page = 1;
  pageSize = 5;
  collectionSize: number;
  rows: any = [];
  attributes: Array<any> = [];
  columns: any[] = [];
  TEXT_LIMIT = 40;

  constructor() { }

  ngOnInit(): void {
    this.initPagination();
    this.initAttributes();
    this.refreshTable();
  }

  refreshTable(): void {
    this.rows = this.message?.attachment?.attachments.rows
      .map((item, index) => ({ id: index + 1, ...item }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    const EVENT = {
      type: 'INSTANT_SCROLL_TO_BOTTOM',
      data: {}
    }
    this.userActionEvent.emit(EVENT);
  }

  onButtonClick(message: string): void {
    if (this.isContentEnabled) {
      return;
    }
    const EVENT = {
      type: 'POST_MESSAGE',
      data: {
        type: 'user',
        text: message,
        timestamp: new Date().getTime()
      }
    };
    this.userActionEvent.emit(EVENT);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  showTooltip(text: string): boolean {
    return this.TEXT_LIMIT >= text?.length;
  }

  private initPagination(): void {
    this.columns = this.message?.attachment?.attachments.columns;
    this.collectionSize = this.message?.attachment?.attachments.rows.length;
  }

  private initAttributes(): void {
    this.attributes = this.message?.attachment?.attributes;
  }

}