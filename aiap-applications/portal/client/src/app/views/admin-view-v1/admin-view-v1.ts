/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  ConfigServiceV1,
} from 'client-shared-services';

import { ZoomServiceV1 } from 'src/app/services';

import {
  UserSaveModalV1,
} from 'client-views';

import {
  AdministratorServiceV1,
} from '../../services';

@Component({
  selector: 'aiap-admin-view-v1',
  templateUrl: './admin-view-v1.html',
  styleUrls: ['./admin-view-v1.scss']
})
export class AdminViewV1 implements OnInit, OnDestroy, AfterViewChecked {

  static getClassName() {
    return 'AdminViewV1';
  }

  @ViewChild('userSaveModal') userSaveModal: UserSaveModalV1;

  session: any;
  sessionSubscription: Subscription;
  currentZoomLevel: String = '100%';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private eventsService: EventsServiceV1,
    public timezoneService: TimezoneServiceV1,
    private administratorService: AdministratorServiceV1,
    private configService: ConfigServiceV1,
    private sessionService: SessionServiceV1,
    private zoomService: ZoomServiceV1,
  ) { }

  ngOnInit(): void {
    this.zoomService.zoomEmitter.subscribe(data => this.currentZoomLevel = data);
  }

  ngOnDestroy(): void {
    //
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const EVENT = {
      type: EventsServiceV1.EVENT_TYPE.EVENT_WINDOW_RESIZE,
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.eventsService.emitWindowEvent(EVENT);
  }

}
