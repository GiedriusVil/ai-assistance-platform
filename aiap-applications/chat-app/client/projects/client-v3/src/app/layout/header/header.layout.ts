import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { EventBusServiceV1 } from "client-services";
import { EVENT_TYPE, MOUSE_STATE } from "client-utils";
import { SessionServiceV2 } from "../../services";

@Component({
  selector: 'aiap-header',
  templateUrl: './header.layout.html',
  styleUrls: ['./header.layout.scss']
})
export class HeaderLayout implements OnInit{


  data: any;
  url: any;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;
  @ViewChild('wbcTemplate', {read: TemplateRef}) wbcTemplate: TemplateRef<any> | undefined;
  

  constructor(
    private eventBus: EventBusServiceV1,
    private sessionService: SessionServiceV2,
  ) { }

  ngOnInit(): void {
    const LAYOUT_ELEMENT = this.sessionService.getSession().engagement.chatApp.layout.header;
    this.url = LAYOUT_ELEMENT.url;
    this.data = LAYOUT_ELEMENT.component;
  }
}
