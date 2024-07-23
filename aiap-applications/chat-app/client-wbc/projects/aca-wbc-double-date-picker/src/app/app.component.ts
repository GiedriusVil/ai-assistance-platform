/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import * as ramda from 'ramda';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';
import { _debugX } from 'client-utils';

@Component({
  selector: 'aca-wbc-double-date-picker',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges, OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  dateFromTitle: string = '';
  dateToTitle: string = '';

  static getElementTag() {
    return 'aca-wbc-double-date-picker';
  }

  title = 'aca-wbc-double-date-picker';

  @Input() state: any;
  @Input() message: any;
  @Output() onWbcEvent = new EventEmitter<any>();

  _state = {
    attributes: [],
    content: {
      enabled: true
    },
  }

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) {
  }

  ngOnInit(): void {
    this.loadHTMLDependencies();
  }

  async ngOnChanges() {
    this.dateFromTitle = ramda.pathOr('', ['attachment', 'attributes', 0, 'dateFromTitle'], this.message);
    this.dateToTitle = ramda.pathOr('', ['attachment', 'attributes', 0, 'dateToTitle'], this.message);
  }

  handleDateSelect() {
    if (!this._state.content.enabled) {
      return;
    }
    const DATA = {
      fromDate: this.formatter.format(this.fromDate),
      toDate: this.formatter.format(this.toDate),
    }
    const MESSAGE: any = {
      type: 'user',
      text: this.formatDate(),
      sender_action: {
        type: 'item_selected',
        data: DATA,
      },
      timestamp: new Date().getTime()
    }
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    _debugX(AppComponent.getElementTag(), 'handleDateSelect', {
      this_state: this._state,
      event: EVENT
    });
    this.onWbcEvent.emit(EVENT);
    this._state.content.enabled = false;
  }

  isDateSelected() {
    let retVal = false;
    if (this.fromDate != null && this.toDate != null) {
      retVal = true;
    }
    return retVal;
  }

  formatDate() {
    let toDate;
    let retVal = this.formatter.format(this.fromDate);
    if (this.toDate != null) {
      toDate = this.formatter.format(this.toDate);
    }
    if (toDate != undefined) {
      retVal = `${retVal} - ${toDate}`;
    }
    return retVal;
  }

  onFromDateSelection(date: NgbDate) {
    this.fromDate = date;
  }

  onToDateSelection(date: NgbDate) {
    if (this.fromDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
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
