import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { EventBusServiceV1, HTMLElementsServiceV1 } from 'client-services';
import { QuickLink } from 'client-utils';

@Component({
  selector: 'aiap-quick-links-modal',
  templateUrl: './quick-links.modal.html',
  styleUrls: ['./quick-links.modal.scss'],
})
export class QuickLinksModal implements OnInit {
  static getClassName() {
    return 'QuickLinksModal';
  }

  height: string;

  @Input() closeIcon: any;
  @Input() links: QuickLink[];
  @Input() modalTitle: string;

  constructor(private elementRef: ElementRef<HTMLElement>, private htmlElementsService: HTMLElementsServiceV1, private eventBus: EventBusServiceV1,) { }

  ngOnInit(): void {
    const INNER_CHAT_ELEMENT = this.htmlElementsService.getElementAcaChatWindowInner();
    const CHAT_WINDOW_STYLES = getComputedStyle(INNER_CHAT_ELEMENT);
    const HEIGHT = INNER_CHAT_ELEMENT.scrollHeight;
    this.height = CHAT_WINDOW_STYLES?.height || `${HEIGHT}px`;
  }

  openModal() {
    const ELEMENT = this.elementRef.nativeElement.querySelector('.quick-links-modal-wrapper');
    ELEMENT.classList.add('open');
  }

  closeModal() {
    this.elementRef.nativeElement.querySelector('.quick-links-modal-wrapper').classList.remove('open');
  }

  onQuickLinkClick(quickLinks: QuickLink) {
    if (Object.prototype.hasOwnProperty.call(quickLinks, 'event')) {
      this.eventBus.emit?.(quickLinks?.event);
    } else {
      window.open(quickLinks?.url, '_blank');
    }
  }
}
