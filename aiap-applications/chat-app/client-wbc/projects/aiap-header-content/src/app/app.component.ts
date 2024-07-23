/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { EventBusServiceV1 } from 'client-services';
import { EVENT_TYPE, MOUSE_STATE } from 'client-utils';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-header-content',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  static getElementTag() {
    return 'aiap-header-content';
  }

  title = 'aiap-header-content';

  constructor(
    private eventBus: EventBusServiceV1,
  ) { }

  mouseState: MOUSE_STATE = MOUSE_STATE.UP;

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: MouseEvent) {
    switch (this.mouseState) {
      case MOUSE_STATE.DOWN:
        
        const EVENT = {
          type: EVENT_TYPE.MOVE_CHAT_WINDOW,
          data: { 
            movementX: e.movementX,
            movementY: e.movementY
          },
        };
        this.eventBus.emit?.(EVENT)
      break;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    console.log(e.target)
    if (e.target instanceof Element && e.target.getAttribute('aiap-draggable')) {  
      this.mouseState = MOUSE_STATE.DOWN;
    }
  }

  @HostListener('document:mouseup') 
  onMouseUp() {
    this.mouseState = MOUSE_STATE.UP;
  }

  closeChat() {
    this.eventBus.emit?.({
      type: EVENT_TYPE.CLOSE_CHAT_WINDOW,
    });
  }
}
