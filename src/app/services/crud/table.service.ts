import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class TableService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'table');
  }

  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/table/table-exists?name=' + name);
  }

}
