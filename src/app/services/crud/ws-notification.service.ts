import { Injectable } from '@angular/core';
import {CrudService} from "./common/crud.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {LogoutDTO} from "../../dtos/security/logout-dto";

@Injectable({
  providedIn: 'root'
})
export class WsNotificationService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'notification');
  }

  getUnread(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/unread`);
  }

  read(id: string): Observable<any> {
    return this.http.put<string>(
      `${environment.serverUrl}/${this.endpoint}/read?id=${id}`, null);
  }

}
