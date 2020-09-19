import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  getDataById(id: any): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/data/by-id?id=${id}`);
  }

  getListResultData(listDto: ListDTO) {
    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/data/results`, listDto);
  }

  getListResultDataExcel(listDto: ListDTO) {

    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/data-excel`, listDto, httpOptions);
  }

  getGroupResultData(listDto: ListDTO) {
    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/data/left-grouping/results`, listDto);
  }


}
