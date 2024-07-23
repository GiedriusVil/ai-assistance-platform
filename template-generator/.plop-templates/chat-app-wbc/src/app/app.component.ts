/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';

@Component({
  selector: 'aiap-{{dashCase name}}',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static getElementTag() {
    return 'aiap-{{dashCase name}}';
  }

  title = 'AIAP {{titleCase name}}';

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) {
  }

  ngOnInit(): void {
    this.loadHTMLDependencies();
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
