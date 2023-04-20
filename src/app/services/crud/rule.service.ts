import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CrudService} from "./common/crud.service";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RuleService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'rule');
  }

  getSettingsById(id: any): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/settings/by-id?id=${id}`);
  }

}
