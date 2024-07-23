/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';
import { _debugX } from 'client-utils';

@Component({
  selector: 'aca-wbc-date-picker',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  static getElementTag() {
    return 'aca-wbc-date-picker';
  }

  title = 'aca-wbc-date-picker';

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

  handleDateSelect() {
    if (!this._state.content.enabled) {
      return;
    }
    const DATA = {
      fromDate: {
        year: this.fromDate?.year,
        month: this.fromDate?.month,
        day: this.fromDate?.day,
      },
      toDate: {
        year: this.toDate?.year,
        month: this.toDate?.month,
        day: this.toDate?.day,
      }
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
    if (this.fromDate != null) {
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
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
