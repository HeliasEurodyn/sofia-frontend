import {Injectable} from '@angular/core';
import {CrudService} from './common/crud.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppViewService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'appview');
  }

  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/appview/table-exists?name=' + name);
  }

  generateViewFields(query: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/appview/generate-view-fields?query=' + query);
  }

}
