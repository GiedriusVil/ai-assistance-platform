/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aca-chat-buttons-list-attachment',
  templateUrl: './buttons-list.attachment.html',
  styleUrls: ['./buttons-list.attachment.scss']
})
export class ButtonsListAttachment implements OnInit {

  @Input() message;
  @Input() isContentEnabled: boolean;

  @Output() userActionEvent = new EventEmitter<any>();

  pageOfItems: Array<any> = [];
  attributes: Array<any> = [];
  selected = 1;
  lastPage: number;

  private itemsPerPage = 5;

  constructor() {}

  ngOnInit(): void {
    this.initPagination();
    this.initAttributes();
  }

  onButtonClick(event: Event, message: string): void {
    event.preventDefault();

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

  nextPage(selectedPage: number): void {
    if (this.selected < this.lastPage) {
      this.selected = selectedPage + 1;
      this.handlePagination(this.message?.attachment?.attachments, this.itemsPerPage, this.selected);
    }
  }

  previousPage(selectedPage: number): void {
    if (this.selected > 1) {
      this.selected = selectedPage - 1;
      this.handlePagination(this.message?.attachment?.attachments, this.itemsPerPage, this.selected);
    }
  }

  isPreviousPageEnabled(): boolean {
    return this.selected === 1;
  }

  isNextPageEnabled(): boolean {
    return this.selected === this.lastPage;
  }

  private initPagination(): void {
    this.handlePagination(this.message?.attachment?.attachments, this.itemsPerPage, this.selected);
    this.lastPage = Math.ceil(this.message?.attachment?.attachments.length / this.itemsPerPage);
  }

  private handlePagination(data: any[], itemsPerPage: number, pageNumber: number): void {
    pageNumber = pageNumber - 1;
    this.pageOfItems = data.slice(pageNumber * itemsPerPage, pageNumber * itemsPerPage + itemsPerPage);
  }

  private initAttributes(): void {
    this.attributes = this.message?.attachment?.attributes;
  }
}
