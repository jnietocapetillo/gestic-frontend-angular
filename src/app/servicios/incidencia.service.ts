import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Incidencia } from '../modelos/incidencia';
import { responseAddIncidencia } from '../modelos/responseAddIncidencia';
import { responseIncidenciaDetalle } from '../modelos/responseIncidenciaDetalle';
import { UpdateIncidencia } from '../modelos/updateIncidencia';


@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  url_incidencias: string = 'http://gestic/incidencias';
  url_add_incidencia: string = 'http://gestic/incidencia/add';
  url_id_perfil: string = 'http://gestic/usuario/idPerfil';
  url_detalle_incidencia : string = 'http://gestic/incidencia/';
  url_incidencia_usuario : string = 'http://gestic/incidencia/usuario/';
  url_imagen_incidencia : string = 'http://gestic/incidencia/imagen';
  url_id_tecnico : string = 'http://gestic/incidencia/tecnico/';
  url_idusuario_idincidencia : string = 'http://gestic/incidencia/idincidencia/';
  url_asignar_tecnico : string = 'http://gestic/incidencia/asignar';
  url_incidencias_tecnico : string = 'http://gestic/incidencias/tecnico';
  url_update_incidencia : string = 'http://gestic/incidencia/update';
  ruta_eliminar_incidencia : string = 'http://gestic/incidencia/';
  ruta_exportar_excel : string = 'http://gestic/incidencias/excel';

  //declaramos una instancia del servicio, donde guardaremos la incidencia seleccionada en el servicio y podremos compartirla
  incidencia : Incidencia = new Incidencia();

  constructor(private http: HttpClient) { }

  /**
   * trae todas las incidencias que hay
   * @returns 
   */
  listadoIncidencias():Observable<Incidencia[]>
  {
    return this.http.get<Incidencia[]>(this.url_incidencias);
  }

  /**
   * funcion que envia por metodo post la incidencia para agregarla
   * @param incidencia 
   * @returns 
   */
  addIncidencia(incidencia : Incidencia):Observable<responseAddIncidencia>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<responseAddIncidencia>(this.url_add_incidencia,incidencia,httpOptions);
  }

  /**
   * envio de imagen para una incidencia
   * @param archivo 
   * @returns 
   */

  addImagenIncidencia(archivo : any):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    
    return this.http.post<any>(this.url_imagen_incidencia,JSON.stringify(archivo),httpOptions);
  }

  /**
   * funcion que trae los datos de una incidencia por su id
   * @param incidencia 
   * @returns 
   */

  detalleIncidencia(incidencia : number):Observable<responseIncidenciaDetalle>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }

    return this.http.get<responseIncidenciaDetalle>(this.url_detalle_incidencia+incidencia, httpOptions);
  }

  /**
   * funcion que devuelve una lista de incidencias de un usuario dado por ID
   * @param usuario 
   * @returns 
   */
  incidenciasUsuario(usuario : number):Observable<Incidencia[]>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<Incidencia[]>(this.url_incidencia_usuario+usuario,httpOptions);
  }

  /**
   * funcion que a través del id de una incidencia nos devuelve el id del tecnico asignado
   * @param idIncidencia 
   * @returns 
   */
  tecnicoIncidencia (idIncidencia : number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<any>(this.url_id_tecnico+idIncidencia,httpOptions);
  }

  /**
   * funcion que devuelve el id del usuario de una incidencia
   * @param id 
   * @returns 
   */
  idUsuarioIdIncidencia(id : number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<any>(this.url_idusuario_idincidencia+id,httpOptions);
  }

  /**
   * funcion que asigna una prioridad y un tecnico a una incidencia
   * @param datos 
   * @returns 
   */
  asignarTecnicoPrioridad(datos : {}):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<any>(this.url_asignar_tecnico, datos, httpOptions);
  }

  /**
   * obtenemos las incidencias de un tecnico dado por id
   * @param id 
   * @returns 
   */
  incidenciasTecnico(id: number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<any>(this.url_incidencias_tecnico, id, httpOptions);
  }

  /**
   * actualiza una incidenica
   * @param datosIncidencia 
   * @returns 
   */
  incidenciaUpdate(datosIncidencia : UpdateIncidencia):Observable<any>
  {
      const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<any>(this.url_update_incidencia,datosIncidencia,httpOptions);
  }

  /**
   * elimina una incidencia dada por parámetros
   * @param id 
   * @returns 
   */
  delIncidencia(id: number):Observable<any>
  {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'multipart/form-data'
        })
      }

    return this.http.delete<any>(this.ruta_eliminar_incidencia+id, httpOptions);
  }

   /**
   * descarga las incidencias en excel
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
