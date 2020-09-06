import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BackEndService } from "./services/back-end.service";
import { GlobalService } from "./services/global.service";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import {
  NgxUiLoaderConfig,
  SPINNER,
  PB_DIRECTION,
  NgxUiLoaderModule,
} from "ngx-ui-loader";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ng6-toastr-notifications";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { APIInterceptor } from './app.interceptor';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.ballScaleMultiple,
  fgsColor: "#fff",
  pbColor: "#000",
  fgsSize: 50,
  gap: 0,
  overlayColor: "rgba(40,40,40,.5)",
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 3,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot({ url: 'http://botquill.herokuapp.com/', options: {} }),
    FormsModule,
  ],
  providers: [BackEndService, GlobalService,
    { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule { }
