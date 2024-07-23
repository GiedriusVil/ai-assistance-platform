import { Injectable } from "@angular/core";
import { EventBusType, EventBusSubscribeType, EventBusEmitType, IChatAppElement, IEvent} from "client-utils";
import { Subject } from "rxjs";

@Injectable()
export class EventBusServiceV1 {

  private static chatAppElementTags = ['chat-app-v3', 'aca-chat-app'];

  constructor() {
    EventBusServiceV1.chatAppElementTags.forEach(el => {
      const CHAT_APP_ELEMENT = document.querySelector<IChatAppElement>(el);
  
      if (!CHAT_APP_ELEMENT) {
        return;
      }
  
      this.eventBus = CHAT_APP_ELEMENT.eventBus ?? new Subject<IEvent>();
      this.subscribe = this.eventBus.subscribe.bind(this.eventBus);
      this.emit = this.eventBus.next.bind(this.eventBus);
    });
  }

  public eventBus: EventBusType;
  public subscribe: EventBusSubscribeType;
  public emit: EventBusEmitType;

  getEventBus() {
    return this.eventBus;
  }
}
