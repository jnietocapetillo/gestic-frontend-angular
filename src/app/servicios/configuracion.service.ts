import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  url_add_departamento : string = 'http://gestic/departamento/add';
  url_add_perfil : string = 'http://gestic/perfil/add';

  constructor(private http: HttpClient) { }

  addDepartamento(departamento: {}):Observable<any>
  { 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<any>(this.url_add_departamento, departamento,httpOptions);
  }

  addPerfil(perfil: {}):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<any>(this.url_add_perfil, perfil,httpOptions);
  }  
}
