/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';

@Component({
  selector: 'aca-wbc-supplier-catalog',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  static getElementTag() {
    return 'aca-wbc-supplier-catalog';
  }

  title = 'aca-wbc-supplier-catalog';

  @Input() state: any;

  @Input() message: any;

  @Output() onWbcEvent = new EventEmitter<any>();

  _state = {
    attributes: [],
    content: {
      enabled: true
    },
  }

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) { }

  ngOnInit() {
    this.loadHTMLDependencies();
  }

  getActiveClassNames() {
    let retVal = 'message--content w-100';
    if (
      !this._state.content.enabled
    ) {
      retVal = `${retVal} content--disabled`;
    }
    return retVal;
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
  }
}
