import { Injectable } from '@angular/core';
import {CrudService} from './common/crud.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'chat');
  }

  countNewMessages(senderId: string, recipientId: string): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/${senderId}/${recipientId}/count`);
  }

  findChatMessages(senderId: string, recipientId: string): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/${senderId}/${recipientId}`);
  }

  findChatMessage(id: string): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/${id}`);
  }

}
