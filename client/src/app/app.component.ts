import { Component } from "@angular/core";
import { BackEndService } from "./services/back-end.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { SearchResult } from "./models/subscribe";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER, P } from "@angular/cdk/keycodes";
import { Keyword } from './models/keywords';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from './models/message';
import { Observable } from 'rxjs';



@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  query: string;
  searchResults: [SearchResult];
  visible = true;
  subscribed = false;
  selectable = true;
  removable = true;
  channelID = Math.random().toString(36).substring(2)
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  keywords: Keyword[] = [];
  messageObserver: Observable<ChatMessage>;
  messages: ChatMessage[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      if (this.keywords.length < 10) {
        this.keywords.push({ value: value.trim() });
      } else {
        this.showToast("Maximum 10 keywords allowed!");
      }
    }

    if (input) {
      input.value = "";
    }
  }

  remove(keyword: Keyword): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }
  constructor(private backend: BackEndService, private toastr: ToastrManager, private socket: Socket) {
    this.messageObserver = this.socket.fromEvent<ChatMessage>(this.channelID);
    this.messageObserver.subscribe(message => {
      this.messages.push(message)
    })
  }

  unsubscribeURL() {
    this.backend
      .unSubscribeURL(this.channelID)
      .subscribe((response) => {
        if (response.body.message) {
          this.showToast(response.body.message);
          this.subscribed = false;
          this.query = '';
          this.channelID = Math.random().toString(36).substring(2);
          this.keywords = [];
          this.messages = [];
          this.messageObserver = this.socket.fromEvent<ChatMessage>(this.channelID);
          this.messageObserver.subscribe(message => {
            this.messages.push(message)
          })
        }
      });
  }

  subscribeURL() {
    if (!!this.query && this.query.trim().length > 0) {
      this.searchResults = undefined;
      this.backend
        .subscribeURL(this.query, this.channelID, this.keywords.map(keyword => keyword.value))
        .subscribe((response) => {
          if (response.body.message) {
            this.showToast(response.body.message);
            this.subscribed = true
            this.messageObserver = this.socket.fromEvent<ChatMessage>(this.channelID);
          }
        });
    } else {
      this.showToast("Please enter a valid youtube url to subscribe!");
    }
  }

  showToast(message: string) {
    this.toastr.customToastr(
      `<span style='color: #green; background:#000; font-family: monospace; font-size: 20px; text-align: center;'>${message}</span>`,
      null,
      { enableHTML: true, maxShown: 2, toastTimeout: 2000 }
    );
  }
  getRatingsWidth(input: any) {
    return (input.stars / input.high) * 100;
  }
}
