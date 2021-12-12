import { Injectable } from '@angular/core';
import { Mensaje } from '../modelos/mensaje';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { responseMensajesUsuario } from '../modelos/responseMensajesUsuario';
import { responseMensajesIncidencia } from '../modelos/responseMensajesIncidencia';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  mensaje : Mensaje = new Mensaje();
  url_add_mensaje : string = 'http://gestic/mensaje/add';
  ruta_mensajes_usuario : string = 'http://gestic/mensajes/';
  ruta_mensajes_no_leidos_usuario : string = 'http://gestic/mensajesnoleidos/';
  url_mensajes_incidencia : string = 'http://gestic/mensajes/incidencia/';
  ruta_imagen_mensaje : string ='http://gestic/mensaje/imagen';
  ruta_marcar_leido : string = 'http://gestic/mensaje/leido/';
  ruta_actualizar_leido_por_incidencia : string = 'http://gestic/mensaje/actualizarMensaje/';
  ruta_detalle_mensaje : string = 'http://gestic/mensaje/';

  constructor(private http: HttpClient) { }

  /**
   * funcion que agrega un mensaje en la base de datos
   * @param mensaje medelo mensaje
   * @returns 
   */
  addMensaje(mensaje: Mensaje):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<any>(this.url_add_mensaje, mensaje,httpOptions);
  }

  detalleMensaje(id : number):Observable<any>
  {
    return this.http.get<any>(this.ruta_detalle_mensaje+id);
  }

  mensajesUsuario(id : number):Observable<responseMensajesUsuario>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<responseMensajesUsuario>(this.ruta_mensajes_usuario+id, httpOptions);
  }

  mensajesNoLeidos(id:number):Observable<responseMensajesUsuario>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<responseMensajesUsuario>(this.ruta_mensajes_no_leidos_usuario+id, httpOptions);
  }

  mensajesIncidencias(id: number):Observable<responseMensajesIncidencia>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<responseMensajesIncidencia>(this.url_mensajes_incidencia+id,httpOptions);
  }

  addImagenMensaje(archivo : any):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    
    return this.http.post<any>(this.ruta_imagen_mensaje,JSON.stringify(archivo),httpOptions);
  }

  marcarLeido(idmensaje : number, mensaje: Mensaje):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.put<any>(this.ruta_marcar_leido+idmensaje,mensaje,httpOptions);
  }

  actualizarLeido(id : number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<any>(this.ruta_actualizar_leido_por_incidencia+id,httpOptions);
  }
}
