/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';

@Component({
  selector: 'aca-wbc-template',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static getElementTag() {
    return 'aca-wbc-template';
  }

  title = 'aca-wbc-template';

  @Input() message: any;
  @Output() onPostMessage = new EventEmitter<any>();


  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) {
  }

  ngOnInit(): void {
    this.loadHTMLDependencies();
  }

  postMessage() {
    const MESSAGE: any = {
      text: 'some_stuff',
      sender_action: 'item_selected'
    }
    console.log('postmessage');
    this.onPostMessage.emit(MESSAGE);
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
