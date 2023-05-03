import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

import {Client, Message, Stomp, StompSubscription} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient;
//  private messageSubject: Observable<Message>;
  private userMessageSubject: Observable<Message>;
  private messageSubject2: Observable<Message>;

  constructor() {
    const ws = new SockJS(`${environment.serverUrl}/sockjs`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.configure({
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      debug: (msg: string) => { console.log(msg); }
    });
    this.stompClient.activate();
  //  this.initializeConnections();
  }

  public initializeUserConnection(userId: string): void {
    this.userMessageSubject = new Observable<Message>((observer) => {
      let subscription: StompSubscription = null;
      const connectCallback = () => {
        subscription = this.stompClient.subscribe('/topic/user-notifications/'+userId, (message) => {
          observer.next(message);
        });
      };
      const errorCallback = (error) => {
        observer.error(error);
      };
      this.stompClient.onConnect = (frame) => {
        connectCallback();
      };
      this.stompClient.onStompError = (frame) => {
        errorCallback(frame);
      };
    });
  }

  public initializeConnections(): void {
    this.messageSubject2 = new Observable<Message>((observer) => {
      let subscription: StompSubscription = null;
      const connectCallback = () => {
        subscription = this.stompClient.subscribe('/topic/messages/10', (message) => {
          observer.next(message);
        });
      };
      const errorCallback = (error) => {
        observer.error(error);
      };
      this.stompClient.onConnect = (frame) => {
        connectCallback();
      };
      this.stompClient.onStompError = (frame) => {
        errorCallback(frame);
      };
    });
  }

  public getUserMessageObservable(): Observable<Message> {
    return this.userMessageSubject;
  }

  public getMessageObservable2(): Observable<Message> {
    return this.messageSubject2;
  }

  public sendMessage(message: string): void {
   // this.stompClient.publish({ destination: '/hello', body: message });
    this.stompClient.send('/app/hello', {}, JSON.stringify({ 'message': message }));

  }
}
