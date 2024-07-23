import { Observer, Subject, Subscription } from "rxjs";
import { IEvent } from "./event.interface";

export type EventBusType = Subject<IEvent> | undefined;
export type EventBusSubscribeType = ((observerOrNext?: Partial<Observer<IEvent>> | ((value: IEvent) => void)) => Subscription) | undefined;
export type EventBusEmitType = ((value: IEvent) => void) | undefined;
