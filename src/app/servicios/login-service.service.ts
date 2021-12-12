import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { login } from '../modelos/login';
import { response } from '../modelos/response';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  url : string = 'http://gestic/login';

  constructor(private http: HttpClient) { }

  login(datos:login):Observable<response>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<response>(this.url,datos,httpOptions);
  }


}
