import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Listado_logs } from '../modelos/listado_logs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  ruta_log_listado : string = 'http://gestic/logs';
  ruta_exportar_excel : string = 'http://gestic/logs/excel';

  constructor(private http:HttpClient) { }

  listado():Observable<Listado_logs>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<Listado_logs>(this.ruta_log_listado,httpOptions);
  }

  /**
   * descarga los logs en excel
   * @returns 
   */
  exportarExcel():Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<any>(this.ruta_exportar_excel, httpOptions);
  }
  
}
