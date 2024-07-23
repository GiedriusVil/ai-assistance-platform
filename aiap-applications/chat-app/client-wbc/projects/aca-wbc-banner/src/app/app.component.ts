/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ChatWidgetServiceV1,
  HTMLDependenciesServiceV1,
  ConfigsServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-wbc-banner',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges {
  static getElementTag() {
    return 'aca-wbc-banner';
  }

  title = 'aca-wbc-banner';
  icons: any = {};

  constructor(
    private configsService: ConfigsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getIcons();
  }

  ngOnInit(): void {
    this.loadHTMLDependencies();
  }

  @Input() message: any;
  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
  }

  getIcons() {
    if (!this.configsService.getHost()) {
      return;
    }

    this.icons['launch'] = this.getIcon('launch.svg', 'launch');
  }

  getIcon(fileName: string, propertyName: string) {
    const ICONS = this.message?.icons || {};
    const ICON_FROM_PARAMETERS = ICONS[propertyName];
    if (ICON_FROM_PARAMETERS) {
      return ICON_FROM_PARAMETERS;
    }

    const RET_VAL = `${this.configsService.getHost()}${this.configsService.getPath()}/${fileName}`;
    return RET_VAL;
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(
      this.elCSSLinkId()
    );
    return RET_VAL;
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(
      this.elCSSLinkId(),
      `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`
    );
  }
}
