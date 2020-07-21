import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class TableComponentService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'component');
  }

}
