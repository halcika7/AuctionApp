import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { environment as dev } from "@env/environment";
import { environment as prod } from "@env/environment.prod";

@Injectable({
  providedIn: "root"
})
export class WebSocketServiceService {
  private _socket;
  private uri: string = dev.production === false ? dev.socketUrl : prod.socketUrl;

  constructor() {
    this._socket = io(this.uri);
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this._socket.on(eventName, data => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this._socket.emit(eventName, data);
  }
}
