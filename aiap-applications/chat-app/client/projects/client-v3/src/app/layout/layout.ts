import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { EventBusServiceV1 } from "client-services";
import { EVENT_TYPE, IEvent } from "client-utils";
import { SessionServiceV2 } from "../services";

@Component({
  selector: 'aiap-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit {

  classes = {
    modal: {
      'aiap-modal-hide': true
    }
  }
  state = {
    isModalOpen: false,
    enabled: {
      leftPanel: true,
      rightPanel: true,
      sideNav: true,
    }
  };

  session: any;

  @Input() columns: any;

  constructor (
    private eventBusService: EventBusServiceV1,
    private changeDetectorRef: ChangeDetectorRef,

    private sessionService: SessionServiceV2,
  ) { }

  ngOnInit(): void {
    this.eventBusService.subscribe?.((value: IEvent) => {
      switch (value.type) {
        case EVENT_TYPE.OPEN_MODAL: this.handleModalOpen(value.data); break;
        case EVENT_TYPE.CLOSE_MODAL: this.handleModalClose(value.data); break;
      }
    });

    // TODO: ANBE DEFAULT VALUE
    const LAYOUT_CONFIGS = this.sessionService.getSession().engagement.chatApp.layout;

    console.log("AA--la", LAYOUT_CONFIGS, this.sessionService.getSession())
    this.state.enabled = {
      leftPanel: LAYOUT_CONFIGS.leftPanel.enabled,
      rightPanel: LAYOUT_CONFIGS.rightPanel.enabled,
      sideNav: LAYOUT_CONFIGS.sideNav.enabled,
    }

    console.log('enabled---', this.state)
  }


  handleModalOpen(data: any) {
    this.classes.modal["aiap-modal-hide"] = false;
    this.changeDetectorRef.detectChanges();
  }

  handleModalClose(data: any) {
    this.classes.modal["aiap-modal-hide"] = true;
    this.changeDetectorRef.detectChanges();
  }

}
