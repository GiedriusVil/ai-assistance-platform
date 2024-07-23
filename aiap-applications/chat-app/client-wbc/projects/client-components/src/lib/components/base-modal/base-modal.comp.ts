/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import * as lodash from 'lodash';

import { _debugX, _errorX } from 'client-utils';

import {
  ModalServiceV1,
  ChatWidgetServiceV1,
  HTMLElementsServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-wbc-base-modal',
  templateUrl: './base-modal.comp.html',
  styleUrls: ['./base-modal.comp.scss'],
})
export class WbcBaseModal implements OnInit, OnDestroy {
  static getClassName() {
    return 'WbcBaseModal';
  }

  @Input() id: any;

  private element: any;

  height: any;
  width: any;
  top: any;
  left: any;

  constructor(
    private modalService: ModalServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlElementsService: HTMLElementsServiceV1,
    private el: ElementRef
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    try {

      if (!this.htmlElementsService.isChatApp()) {
        this.element.remove();
        return;
      }

      if (!this.id) {
        _errorX(
          WbcBaseModal.getClassName(),
          'ngOnInit',
          'Missing required this.id attribute!'
        );
        return;
      }
      const ELEMENT = this.htmlElementsService.chatWindowChildById(this.id);
      if (ELEMENT && ELEMENT !== this.element) {
        this.element.remove();
        this.modalService.duplicate(this.id);
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
      _errorX(WbcBaseModal.getClassName(), 'ngOnInit', { error });
      throw error;
    }
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    let widgetOptions: any;
    let acaChatWindowElement: any;
    try {
      widgetOptions = this.chatWidgetService.getWidgetOptions();
      if (lodash.isEmpty(widgetOptions)) {
        this.height = '100%';
        this.width = '100%';
      } else {
        const CHAT_WINDOW_INNER = this.htmlElementsService.getElementAcaChatWindowInner();
        const CHAT_WINDOW_STYLES = getComputedStyle(CHAT_WINDOW_INNER);

        const LEFT_PANEL = this.htmlElementsService.getElementAcaLeftPanel();

        let leftPanelStyles;

        if (LEFT_PANEL) {
          leftPanelStyles = getComputedStyle(LEFT_PANEL);
        }
        const LEFT_PANEL_WIDTH =
          (leftPanelStyles?.display !== 'none' &&
            Number(leftPanelStyles?.width?.replace('px', ''))) ||
          0;

        this.height = `${Number(CHAT_WINDOW_STYLES.height?.replace('px', '')) ||
          widgetOptions?.windowSize.height
          }px`;
        this.width = `${(Number(CHAT_WINDOW_STYLES.width?.replace('px', '')) ||
          widgetOptions?.windowSize.width) + LEFT_PANEL_WIDTH
          }px`;

        const BOUNDING_BOX = CHAT_WINDOW_INNER.getBoundingClientRect();

        this.top = BOUNDING_BOX.top;
        this.left = BOUNDING_BOX.left - LEFT_PANEL_WIDTH;
      }
      this.element.style.display = 'block';

      acaChatWindowElement = this.htmlElementsService.getElementAcaChatWindow();
      acaChatWindowElement.classList.add('aca--modal--open');
      _debugX(WbcBaseModal.getClassName(), 'open', { widgetOptions });
    } catch (error: any) {
      _errorX(WbcBaseModal.getClassName(), 'open', {
        widgetOptions,
        acaChatWindowElement,
        error,
      });
      throw error;
    }
  }

  close(): void {
    let acaChatWindowElement: any;
    try {
      this.element.style.display = 'none';

      acaChatWindowElement = this.htmlElementsService.getElementAcaChatWindow();
      acaChatWindowElement.classList.remove('aca--modal--open');
    } catch (error) {
      _errorX(WbcBaseModal.getClassName(), 'close', {
        acaChatWindowElement,
        error,
      });
      throw error;
    }
  }
}
