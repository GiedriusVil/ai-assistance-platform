/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import * as lodash from 'lodash';

import { MultimediaBoxComp } from 'client-components';
import { ChatWidgetServiceV1, ConfigsServiceV1, EventsServiceV1 } from 'client-services';

import { _debugX } from 'client-utils';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'aiap-answer-comp',
  templateUrl: './answer.comp.html',
  styleUrls: ['./answer.comp.scss'],
})
export class AnswerComponent implements OnInit, OnDestroy {

  static getClassname() {
    return 'AnswerComponent';
  }

  @Input() answer: any;
  @Input() message: any;

  @Output() onBtnClickEvent = new EventEmitter<any>();
  @Output() onFeedbackClickEvent = new EventEmitter<any>();

  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('multimedia') multimedia: MultimediaBoxComp;

  assetsUrl: string;
  icons: any = {};
  eventsSubscription: Subscription;
  multimediaOptions = {
    header: 'none'
  };

  constructor(
    private configsService: ConfigsServiceV1,
    private eventsService: EventsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
  ) { }

  ngOnInit(): void {
    this.getIcons();
    this.subscribeToEvents();
    this.setAssetsUrl();
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  emitBtnClickEmitEvent(event: any) {
    _debugX(AnswerComponent.getClassname(), 'emitBtnClickEmitEvent', { event });
    this.onBtnClickEvent.emit(event);
  }

  handleFeedbackClickEvent(event) {
    this.onFeedbackClickEvent.emit(event);
  }

  calculatePreviewSize() {
    const PREVIEW_SIZE = 300;
    const ICON_SIZE = 16;

    if (!this.wrapper) return;
    const EL_WRAPPER = this.wrapper.nativeElement;

    const MULT_WRAP: HTMLElement = EL_WRAPPER.querySelector('.multimedia--wrapper')
    const MULT: HTMLElement = MULT_WRAP.querySelector('aiap-multimedia-box');

    const HALF_LENGTH = +getComputedStyle(EL_WRAPPER).width.replace('px', '') / 2

    if (HALF_LENGTH >= PREVIEW_SIZE + ICON_SIZE) {
      return;
    }

    const ICONS: HTMLElement = EL_WRAPPER.querySelector('.multimedia--actions');

    const RATIO = (HALF_LENGTH - ICON_SIZE) / PREVIEW_SIZE;
    MULT.style.transform = `scale(${RATIO})`;
    ICONS.style.right = `${PREVIEW_SIZE * (1 - RATIO)}px`;
    return {
      width: `${PREVIEW_SIZE * RATIO + 16}px`,
      height: `${PREVIEW_SIZE * RATIO + 16}px`,
    }
  }

  getIcons() {
    this.icons['download'] = this.getIcon('download.svg', 'download');
    this.icons['print'] = this.getIcon('printer.svg', 'print');
  }

  getIcon(fileName: string, propertyName: string) {
    const ICONS = this.message?.icons || {};
    const ICON_FROM_PARAMETERS = ICONS[propertyName];
    if (ICON_FROM_PARAMETERS) {
      return ICON_FROM_PARAMETERS;
    }

    const RET_VAL = `${this.configsService.getHost()}${this.configsService.getPath()}/assets/${fileName}`;
    return RET_VAL;
  }

  printerClick() {
    this.multimedia.print();
  }

  downloadClick() {
    this.multimedia.download();
  }

  setAssetsUrl() {
    if (!lodash.isEmpty(this.configsService.getHost()) && lodash.isString(this.configsService.getPath())) {
      this.assetsUrl = `${this.configsService.getHost()}${this.configsService.getPath()}/assets`;
      return;
    }

    const HOST_URL = this.chatWidgetService.getClientWbcHostUrl();
    this.assetsUrl = `${HOST_URL}/${AppComponent.getElementTag()}/assets`;
  }

  private subscribeToEvents() {
    this.eventsService.eventEmit({ configsUpdated: true });
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe((event) => {
      if (!event.configsUpdated) {
        return;
      }

      this.getIcons();
    })
  }
}
