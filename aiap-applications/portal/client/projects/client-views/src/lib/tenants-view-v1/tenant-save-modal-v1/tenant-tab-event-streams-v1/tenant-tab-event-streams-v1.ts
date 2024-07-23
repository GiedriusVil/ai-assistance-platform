/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  replaceByIdOrAddAsNew,
} from 'client-shared-utils';

import {
  TenantEventStreamsSaveModalV1,
} from './tenant-event-streams-save-modal-v1/tenant-event-streams-save-modal-v1';

import {
  TenantRedisClientsSaveModalV1,
} from './tenant-redis-clients-save-modal-v1/tenant-redis-clients-save-modal-v1';

@Component({
  selector: 'aiap-tenant-tab-event-streams-v1',
  templateUrl: './tenant-tab-event-streams-v1.html',
  styleUrls: ['./tenant-tab-event-streams-v1.scss'],
})
export class TenantTabEventStreamsV1 {

  static getClassName() {
    return 'TenantTabEventStreamsV1';
  }

  @ViewChild('redisClientsSaveModal') redisClientsSaveModal: TenantRedisClientsSaveModalV1;
  @ViewChild('eventStreamsSaveModal') eventStreamsSaveModal: TenantEventStreamsSaveModalV1;

  @Input() redisClients: Array<any>;
  @Output() redisClientsChange = new EventEmitter<Array<any>>();

  @Input() eventStreams: Array<any>;
  @Output() eventStreamsChange = new EventEmitter<any>();

  handleRedisClientAddEvent(client: any) {
    _debugX(TenantTabEventStreamsV1.getClassName(), 'handleRedisClientAddEvent',
      {
        client,
      });

    const NEW_CLIENTS = lodash.cloneDeep(this.redisClients);
    replaceByIdOrAddAsNew(NEW_CLIENTS, client);
    this.redisClientsChange.emit(NEW_CLIENTS);
  }

  handleEventStreamAddEvent(evenStream: any) {
    _debugX(TenantTabEventStreamsV1.getClassName(), 'handleEventStreamAddEvent',
      {
        evenStream,
      });

    const NEW_EVENTSTREAMS = lodash.cloneDeep(this.eventStreams);
    replaceByIdOrAddAsNew(NEW_EVENTSTREAMS, evenStream);
    this.eventStreamsChange.emit(NEW_EVENTSTREAMS);
  }

  handleRedisClientSavePlaceShowEvent(event: any) {
    _debugX(TenantTabEventStreamsV1.getClassName(), 'showEventStreamSaveModal',
      {
        event,
      });

    const CLIENT = event?.value;
    this.redisClientsSaveModal.show(CLIENT);
  }

  handleEventStreamSavePlaceShowEvent(event: any) {
    _debugX(TenantTabEventStreamsV1.getClassName(), 'showEventStreamSaveModal',
      {
        event,
      });

    const EVENT_STREAM = event?.value;
    this.eventStreamsSaveModal.show(EVENT_STREAM, this.redisClients, this.redisClients);
  }

  handleRedisClientDeleteEvent(event: any) {
    _debugX(TenantTabEventStreamsV1.getClassName(), 'handleRedisClientDeleteEvent',
      {
        event,
      });

    const ITEM_TO_REMOVE = event;
    const REDIS_CLIENTS = lodash.cloneDeep(this.redisClients);
    lodash.remove(REDIS_CLIENTS, { id: ITEM_TO_REMOVE?.id });
    this.redisClientsChange.emit(REDIS_CLIENTS);
  }

  handleEventStreamDeleteEvent(event: any) {
    _debugX(TenantTabEventStreamsV1.getClassName(), 'handleEventStreamDeleteEvent',
      {
        event,
      });

    const ITEM_TO_REMOVE = event;
    const NEW_EVENT_STREAMS = lodash.cloneDeep(this.eventStreams);
    lodash.remove(NEW_EVENT_STREAMS, { id: ITEM_TO_REMOVE?.id });
    this.eventStreamsChange.emit(NEW_EVENT_STREAMS);
  }

}
