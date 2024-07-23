import { EVENT_TYPE } from "./event-type.enum";

export interface IEvent {
  type: EVENT_TYPE,
  data?: any,
};
