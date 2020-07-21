import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'menu');
  }

  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/menu/table-exists?name=' + name);
  }

}
