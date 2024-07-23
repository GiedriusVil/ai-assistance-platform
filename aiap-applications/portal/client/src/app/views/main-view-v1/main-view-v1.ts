/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  ConfigServiceV1,
} from 'client-shared-services';

import { SessionExpirationModalV1 } from './session-expiration-modal-v1/session-expiration-modal-v1';
import { ZoomServiceV1 } from 'src/app/services';

@Component({
  selector: 'aiap-main-view-v1',
  templateUrl: './main-view-v1.html',
  styleUrls: ['./main-view-v1.scss']
})
export class MainViewV1 implements OnInit, AfterViewChecked {

  static getClassName() {
    return 'MainViewV1';
  }

  @ViewChild('chatwidget') chatwidget;
  @ViewChild('chatframe') chatframe;
  @ViewChild('chatwidgetbutton') chatwidgetbutton;
  @ViewChild('datanotification') datanotification;

  @ViewChild('sessionExpirationModal') sessionExpirationModal: SessionExpirationModalV1;


  widgetEnabled: boolean = ramda.toLower(ramda.pathOr('false', ['widgetEnabled'], this.configService.getConfig())) === 'true';
  subscription: Subscription; // 2021-12-06 [LEGO] Can we remove this?
  notificationsSubscription: Subscription; // 2021-12-06 [LEGO] Can we remove this?
  currentZoomLevel: String = '100%';

  session: any;
  sessionSubscription: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private eventsService: EventsServiceV1,
    public timezoneService: TimezoneServiceV1,
    private configService: ConfigServiceV1,
    private sessionService: SessionServiceV1,
    private zoomService: ZoomServiceV1,
  ) { }

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.sessionSubscription = this.sessionService.sessionEmitter.subscribe((session: any) => {
      this.session = session;
    });
    this.zoomService.zoomEmitter.subscribe(data => this.currentZoomLevel = data);
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const EVENT = {
      type: EventsServiceV1.EVENT_TYPE.EVENT_WINDOW_RESIZE,
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.eventsService.emitWindowEvent(EVENT);
  }

}
