/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

import {
  _debugX,
  ensureIdExistance,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-tenant-event-streams-save-modal-v1',
  templateUrl: './tenant-event-streams-save-modal-v1.html',
  styleUrls: ['./tenant-event-streams-save-modal-v1.scss'],
})
export class TenantEventStreamsSaveModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TenantEventStreamsSaveModalV1';
  }

  @Output() onAddEventStream = new EventEmitter<any>();

  private _destroyed$: Subject<void> = new Subject();

  isOpen = false;

  _selections: any = {
    eventStreamTypes: [
      {
        content: 'Redis',
        value: 'redis'
      },
      {
        content: 'Kafka (Disabled)',
        value: 'kafka'
      }
    ],
    eventStreamType: undefined,
    receivers: [],
    receiver: undefined,
    emitters: [],
    emitter: undefined,
  };

  _eventStream = {
    name: undefined,
    type: undefined,
    scope: undefined,
    clientEmitter: undefined,
    clientReceiver: undefined,
  };

  eventStream = lodash.cloneDeep(this._eventStream);
  selections = lodash.cloneDeep(this._selections);

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(eventStream: any, emitters: Array<any>, receivers: Array<any>) {
    _debugX(TenantEventStreamsSaveModalV1.getClassName(), 'show',
      {
        eventStream,
      });

    this.selections = lodash.cloneDeep(this._selections);
    const ID = eventStream?.id;
    if (
      lodash.isEmpty(ID)
    ) {
      this.eventStream = lodash.cloneDeep(this._eventStream);
    } else {
      this.eventStream = lodash.cloneDeep(eventStream);
    }
    this.setEmitterSelections(emitters);
    this.setReceiverSelections(receivers);
    this.setEventStreamTypeSelections();
    this.isOpen = true;
  }

  save() {
    const EVENT_STREAM = this.getSanitizedEventStream();
    ensureIdExistance(EVENT_STREAM);
    _debugX(TenantEventStreamsSaveModalV1.getClassName(), 'save',
      {
        EVENT_STREAM,
      });

    this.onAddEventStream.emit(EVENT_STREAM);
    this.close();
  }

  close() {
    this.isOpen = false;
  }

  private getSanitizedEventStream() {
    const RET_VAL = lodash.cloneDeep(this.eventStream);

    RET_VAL.type = this.selections?.eventStreamType?.value;
    RET_VAL.clientEmitter = this.selections?.emitter?.value;
    RET_VAL.clientReceiver = this.selections?.receiver?.value;

    return RET_VAL;
  }

  private setEmitterSelections(emitters: Array<any>) {
    this.selections.emitters = this.transformRedisClientsToDropdownItems(emitters);
    const EVENT_STREAM_SELECTED = this.eventStream?.clientEmitter;
    for (const EMITTER of this.selections.emitters) {
      if (
        EVENT_STREAM_SELECTED === EMITTER?.value
      ) {
        EMITTER.selected = true;
        this.selections.emitter = EMITTER;
        break;
      }
    }
  }

  private setReceiverSelections(receivers: Array<any>) {
    this.selections.receivers = this.transformRedisClientsToDropdownItems(receivers);
    const EVENT_STREAM_SELECTED = this.eventStream?.clientReceiver;
    for (const RECEIVER of this.selections.receivers) {
      if (
        EVENT_STREAM_SELECTED === RECEIVER?.value
      ) {
        RECEIVER.selected = true;
        this.selections.receiver = RECEIVER;
        break;
      }
    }
  }

  private setEventStreamTypeSelections() {
    const TYPE_SELECTED = this.eventStream?.type;
    for (const EVENT_STREAM_TYPE of this.selections.eventStreamTypes) {
      if (
        TYPE_SELECTED === EVENT_STREAM_TYPE?.value
      ) {
        EVENT_STREAM_TYPE.selected = true;
        this.selections.eventStreamType = EVENT_STREAM_TYPE;
        break;
      }
    }
  }

  private transformRedisClientsToDropdownItems(clients: Array<any>) {
    const RET_VAL = [];
    if (
      lodash.isArray(clients) &&
      !lodash.isEmpty(clients)
    ) {
      for (const CLIENT of clients) {
        if (
          lodash.isString(CLIENT?.name) &&
          !lodash.isEmpty(CLIENT?.name) &&
          lodash.isString(CLIENT?.id) &&
          !lodash.isEmpty(CLIENT?.id) &&
          lodash.isString(CLIENT?.type) &&
          !lodash.isEmpty(CLIENT?.type) &&
          'redis' === CLIENT.type
        ) {
          const OPTION = {
            content: CLIENT.name,
            value: CLIENT.id,
          };
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

}
