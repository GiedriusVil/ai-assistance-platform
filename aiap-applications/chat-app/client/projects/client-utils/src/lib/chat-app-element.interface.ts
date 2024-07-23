import { Subject } from "rxjs";
import { IEvent } from "./event.interface";

export interface IChatAppElement extends Element {
  eventBus?: Subject<IEvent>
}
