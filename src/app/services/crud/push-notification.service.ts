import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CrudService} from "./common/crud.service";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'push-notification');
  }

  register(token: string) {
    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/register`, {token: token});
  }

  getMenuFromBackend(id: any, languageId: any): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/by-id?id=${id}&language-id=${languageId}`);
  }
}
