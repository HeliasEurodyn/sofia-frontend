import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CrudService} from './crud.service';
import {LoginInfoDto} from '../../../dtos/user/login-info-dto';
import {environment} from '../../../../environments/environment';


/**
 * A service providing functionality for the user of the application, including authentication,
 * authorisation and session management.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<any> {

  public static getJwt(): string {
    return localStorage.getItem('JWT');
  }

  constructor(public http: HttpClient) {
    super(http, 'user');
  }

  login(loginInfoDTO: LoginInfoDto): Observable<string> {
    return this.http.post<string>(
      `${environment.serverUrl}/${this.endpoint}/auth`,
      loginInfoDTO);
  }


  getCurrentUser(): Observable<any> {
    const bearer = localStorage.getItem('jwt_token')

    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/current`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });

  }

}
