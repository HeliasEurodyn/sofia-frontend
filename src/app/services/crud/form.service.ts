import {Injectable} from '@angular/core';
import {CrudService} from './common/crud.service';
import {HttpClient} from '@angular/common/http';
import {FormDto} from '../../dtos/form/form-dto';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService extends CrudService<FormDto> {

  constructor(public http: HttpClient) {
    super(http, 'form');
  }

  saveData(id: number, data) {
    const componentValues = this.mapsToArray(data);
    return this.http.post<any>(`${environment.serverUrl}/${this.endpoint}/data?id=${id}`, componentValues);
  }

  private mapsToArray(data) {
    const componentValues = {};
    data.forEach((tableArray, tableName: string) => {
      const componentValue = {};
      tableArray.forEach((val: string, key: string) => {
        componentValue[key] = val;
      });
      componentValues[tableName] = componentValue;
    });
    return componentValues;
  }

}
