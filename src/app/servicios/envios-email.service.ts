import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviosEmailService {

  constructor(private http:HttpClient) { }

  ruta_envio_email : string = 'http://gestic/email';

  email_usuario(datos:{}):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }

    return this.http.post<any>(this.ruta_envio_email, datos, httpOptions);
  }
}
