import { IEvent } from './event.interface';

export type QuickLinks = {
  enabled: boolean;
  data: QuickLinksData[]
  icon: {
    enabled: boolean;
    url: string;
  };
}

export type QuickLinksData = {
  language: string;
  modalTitle: string;
  links: QuickLink[]
};

export type QuickLink = {
  id: string;
  title: string;
  event?: IEvent;
  url?: string;
}
