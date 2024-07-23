/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { EventBusServiceV1 } from 'client-services';
import { EVENT_TYPE, IEvent } from 'client-utils';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-right-panel-content',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  static getElementTag() {
    return 'aiap-right-panel-content';
  }

  title = 'aiap-right-panel-content';

  userImage: string = '';

  session: any = {};

  constructor(
    private eventBusService: EventBusServiceV1,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadSession();
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.eventBusService.subscribe?.((value: IEvent) => {
      switch (value.type) {
        case EVENT_TYPE.SESSION_CHANGE: this.handleSessionChangeEvent(value.data); break;
      }
    });
  }

  handleSessionChangeEvent(session: any) {
    this.session = session;
    this.constructImageUrl();
  }

  
  loadSession() {
    this.eventBusService.emit?.({
      type: EVENT_TYPE.LOAD_SESSION,
      data: this.load.bind(this),
    });
  };

  load(session: any) {
    console.log("LOAD_RIGHT", session)
    this.session = lodash.cloneDeep(session);
    this.constructImageUrl();
  }


  constructImageUrl() {
    console.log('mano-sesisioa_RIGHT',this.session)
    if (this.session?.user?.id) {
      this.userImage = `https://w3-unifiedprofile-api.dal1a.cirrus.ibm.com/v3/image/${this.session.user.id}?def=avatar`;
      this.ref.detectChanges();
    }
  }
}
