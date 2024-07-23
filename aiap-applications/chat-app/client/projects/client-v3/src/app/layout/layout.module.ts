import { LazyElementsModule } from "@angular-extensions/elements";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BaseLayout } from "./base/base.layout";
import { HeaderLayout } from "./header/header.layout";
import { Layout } from "./layout";
import { LeftPanelLayout } from "./left-panel/left-panel.layout";
import { RightPanelLayout } from "./right-panel/right-panel.layout";
import { SideNavLayout } from "./side-nav/side-nav.layout";
import { ModalLayout } from "./modal/modal.layout";

@NgModule({
  declarations: [
    BaseLayout,
    HeaderLayout,
    LeftPanelLayout,
    RightPanelLayout,
    SideNavLayout,
    ModalLayout,
    Layout
  ],
  exports: [
    Layout
  ],
  imports: [
    NgbModule,
    BrowserModule,
    LazyElementsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule { }
  