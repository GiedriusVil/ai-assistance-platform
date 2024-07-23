/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService, HTMLElementsService } from '../../services';

import {
  ChatWidgetServiceV1,
  LeftPanelServiceV1,
  SessionServiceV2,
} from "client-services";

import { _debugX, _errorX } from "client-utils";

@Component({
  selector: 'aca-chat-modal',
  templateUrl: 'base.modal.html',
  styleUrls: ['base.modal.scss'],
})
export class BaseModal implements OnInit, OnDestroy {
  static getClassName() {
    return 'BaseModal';
  }

  @Input() id: string;

  private element: any;

  height: any;
  width: any;
  top: any;
  left: any;
  zoom = '100%';

  constructor(
    private modalService: ModalService,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlElementsService: HTMLElementsService,
    private el: ElementRef,
    private leftPanelService: LeftPanelServiceV1,
    private sessionService: SessionServiceV2,
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    try {
      if (!this.id) {
        _errorX(
          BaseModal.getClassName(),
          'ngOnInit',
          'Missing required this.id attribute!'
        );
        return;
      }
      this.htmlElementsService.appendChildToAcaChatWindow(this.element);
      this.element.addEventListener('click', (el) => {
        if (el.target.className === 'aca-modal') {
          this.close();
        }
      });
      this.modalService.add(this);
    } catch (error: any) {
      _errorX(BaseModal.getClassName(), 'ngOnInit', { error });
      throw error;
    }
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    let widgetOptions: any;
    let acaChatWindowElement: Element;
    try {
      widgetOptions = this.chatWidgetService.getWidgetOptions();
      const CHAT_WINDOW_INNER = this.htmlElementsService.getElementAcaChatWindowInner();
      const CHAT_WINDOW_STYLES = getComputedStyle(CHAT_WINDOW_INNER);

      const LEFT_PANEL_WIDTH = this.leftPanelService.isLeftPanelVisible()
        ? this.leftPanelService.leftPanelWidth()
        : 0;

      this.height =
        Number(CHAT_WINDOW_STYLES.height?.replace('px', '')) ||
        widgetOptions?.windowSize.height;
      this.width =
        (Number(CHAT_WINDOW_STYLES.width?.replace('px', '')) ||
          widgetOptions?.windowSize.width) + LEFT_PANEL_WIDTH;

      const BOUNDING_BOX = CHAT_WINDOW_INNER.getBoundingClientRect();
      const IS_FULL_SCREEN = this.sessionService.getSession()?.engagement?.chatApp?.isFullscreen ?? false;

      this.top = BOUNDING_BOX.top;
      this.left = IS_FULL_SCREEN ? BOUNDING_BOX.left - LEFT_PANEL_WIDTH / 2 : BOUNDING_BOX.left;
      const ZOOM = this.chatWidgetService.getWidgetOptions()?.zoom || 100;
      this.zoom = `${ZOOM}%`;

      this.element.style.display = 'block';

      acaChatWindowElement = this.htmlElementsService.getElementAcaChatWindow();
      acaChatWindowElement.classList.add('aca--modal--open');
      _debugX(BaseModal.getClassName(), 'open', { widgetOptions });
    } catch (error: any) {
      _errorX(BaseModal.getClassName(), 'open', {
        widgetOptions,
        acaChatWindowElement,
        error,
      });
      throw error;
    }
  }

  close(): void {
    let acaChatWindowElement: Element;
    try {
      this.element.style.display = 'none';

      acaChatWindowElement = this.htmlElementsService.getElementAcaChatWindow();
      acaChatWindowElement.classList.remove('aca--modal--open');
    } catch (error) {
      _errorX(BaseModal.getClassName(), 'close', {
        acaChatWindowElement,
        error,
      });
      throw error;
    }
  }
}
