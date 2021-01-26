import {Injectable} from '@angular/core';
import {CrudService} from './common/crud.service';
import {HttpClient} from '@angular/common/http';
import {FormDto} from '../../dtos/form/form-dto';

@Injectable({
  providedIn: 'root'
})
export class FormService extends CrudService<FormDto> {

  constructor(public http: HttpClient) {
    super(http, 'form');
  }

}
