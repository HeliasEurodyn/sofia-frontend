import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudService} from './common/crud.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ListDTO} from '../../dtos/list/list-dto';

@Injectable({
  providedIn: 'root'
})
export class ListService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'list');
  }

  getByName(name: any): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/by-name?name=${name}`);
  }

  getListResultData(listDto: ListDTO) {
    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/data`,  listDto);
  }

  getGroupResultData(listDto: ListDTO) {
    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/left-grouping-data`,  listDto);
  }


}
