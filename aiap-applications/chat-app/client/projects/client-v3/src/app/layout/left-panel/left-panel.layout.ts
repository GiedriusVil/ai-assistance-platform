import { ChangeDetectorRef, Component, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { EventBusServiceV1 } from "client-services";
import { EVENT_TYPE, IEvent } from "client-utils";
import { SessionServiceV2 } from "../../services";

@Component({
  selector: 'aiap-left-panel',
  templateUrl: './left-panel.layout.html',
  styleUrls: ['./left-panel.layout.scss']
})
export class LeftPanelLayout {


  data: any;
  url: any;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;
  @ViewChild('wbcTemplate', {read: TemplateRef}) wbcTemplate: TemplateRef<any> | undefined;
  
  constructor(
    private eventBus: EventBusServiceV1,
    private sessionService: SessionServiceV2,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.eventBus.subscribe?.(this.onEventBus.bind(this));

    const LAYOUT_ELEMENT = this.sessionService.getSession().engagement.chatApp.layout.leftPanel;
    this.url = LAYOUT_ELEMENT.url;
    this.data = LAYOUT_ELEMENT.component;
  }

  ngAfterViewInit(): void {
    // this.swapWbcView();
  }

  onEventBus(value: IEvent) {
    switch (value.type) {
      case EVENT_TYPE.CHANGE_LEFT_PANEL_WBC: this.handleBaseWbcEvent(value.data); break;
    }
  }

  // TODO ANBE
  handleBaseWbcEvent(data: any) {
    this.data = data.component;
    this.url = `http://localhost:3000/client-wbc/${this.data}/main.js`;
    this.swapWbcView();
  }

  swapWbcView() {
    if (!this.wbcTemplate) {
      return;
    }

    this.container?.clear();
    this.container?.createEmbeddedView(this.wbcTemplate);

    this.ref.detectChanges();
  }
}
