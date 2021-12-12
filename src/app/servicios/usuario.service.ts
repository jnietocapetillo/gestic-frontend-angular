import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseUpdate } from '../modelos/responseUpdate';
import { Usuario } from '../modelos/usuario';
import { actualizarPassword } from '../modelos/resetPassword';
import { responseUpdatePassword } from '../modelos/responseUpdatePassword';
import { enviarEmail } from '../modelos/envioEmail';
import { responseAddUser } from '../modelos/responseAddUser';
import { Perfil } from '../modelos/perfil';
import { Departamento } from '../modelos/departamento';
import { responseIdPerfil } from '../modelos/responseIdPerfil';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  ruta_api_usuarios:string = 'http://gestic/usuarios';
  ruta_api_actualizar_password : string = 'http://gestic/usuarios/reset';
  ruta_api_id_usuario : string = 'http://gestic/usuario/idEmail';
  ruta_add_usuario : string = 'http://gestic/usuarios/add';
  ruta_id_perfil : string = 'http://gestic/usuario/idPerfil/';
  ruta_perfiles : string = 'http://gestic/perfiles';
  ruta_departamentos : string = 'http://gestic/departamentos';
  ruta_nombre_id_perfil : string = 'http://gestic/perfil/nombre/';
  ruta_id_Nombre_perfil : string = 'http://gestic/perfil/';
  ruta_nombre_departamento : string = 'http://gestic/departamento/';
  ruta_nombre_tecnico : string = 'http://gestic/usuarios/nombre/';
  ruta_imagen_usuario : string = 'http://gestic/usuario/imagen';
  ruta_activar_usuario : string = 'http://gestic/usuario/activar/';
  ruta_tecnicos_disponibles : string = 'http://gestic/usuario/tecnicos';
  ruta_imprimir_pdf : string = 'http://gestic/usuarios/pdf';
  ruta_eliminar_usuario : string = 'http://gestic/usuarios/';
  ruta_detalle_usuario : string = 'http://gestic/usuario/detalle/';
  ruta_desactivar : string = 'http://gestic/usuario/desactivar/';
  ruta_exportar_excel : string = 'http://gestic/usuarios/excel';
  ruta_login_google: string = 'http://gestic/login/google';

  usuario : Usuario = new Usuario();   //instanciamos un usuario que estara accesible en los demas componentes
  nombrePerfil : string = '';
  nombreDepartamento : string = '';
  constructor(private http:HttpClient) { 
  }

  loginGoogle(datos : {}):Observable<any> 
  {
      const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
      }

    return this.http.post<any>(this.ruta_login_google,datos,httpOptions);
  }

  detalleUsuario(id : number):Observable<any>
  {
      const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }

    return this.http.get<any>(this.ruta_detalle_usuario+id, httpOptions);
  }
  /**
   * funcion solicitar a API lista de usuarios
   * @returns Usuario[]
   */
  listaUsuarios() : Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<any>(this.ruta_api_usuarios, httpOptions);
  }

  updateUsuario(datosUsuario : Usuario): Observable<responseUpdate>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.put<responseUpdate>(this.ruta_api_usuarios +'/' +datosUsuario.idusuario,datosUsuario,httpOptions);
  }

  /**
   * funcion que consulta el id de un usuario a traves de su correo
   * @param datosUsuario 
   * @returns 
   */
  idUsuario(email :enviarEmail):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    
    return this.http.post<any>(this.ruta_api_id_usuario,email,httpOptions);
  }

  /**
   * funcion que actualliza la contraseña de un usuario en la base de datos
   * @param datosActualizar 
   * @returns 
   */
  updatePassword(datosActualizar : actualizarPassword):Observable<responseUpdatePassword>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<responseUpdatePassword>(this.ruta_api_actualizar_password,datosActualizar,httpOptions);
  }

  /**
   * funcion que agrega un nuevo usuario a la base de datos
   * @param nuevoUsuario 
   * @returns 
   */
  addUsuario(nuevoUsuario : Usuario):Observable<responseAddUser>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.post<responseAddUser>(this.ruta_add_usuario, nuevoUsuario,httpOptions);
  }

  /**
   * funcion que sube una foto de perfil de usuario
   * @param archivo 
   * @returns 
   */
  addImagenUsuario(archivo : any):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    
    return this.http.post<any>(this.ruta_imagen_usuario,JSON.stringify(archivo),httpOptions);
  }

  /**
   * obtiene el id de un usuario a través de un perfil determinado
   * @param perfil 
   * @returns 
   */
  idPerfilUsuario(perfil :number): Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }

    return this.http.get<any>(this.ruta_id_perfil+perfil,httpOptions);
  }

  /**
   * funcion que obtiene el ID de un perfil a través del nombre de perfil
   * @param nombre 
   * @returns 
   */
  nombrePerfilUsuario (nombre:string):Observable<responseIdPerfil>
  {  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<responseIdPerfil>(this.ruta_nombre_id_perfil+nombre,httpOptions);
  }

  /**
   * Obtiene el Nombre del perfil con el ID pasado por parámetro
   * @param dato 
   * @returns 
   */
  perfilUsuario(dato : number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<any>(this.ruta_id_Nombre_perfil+dato,httpOptions);
  }

  /**
   * 
   * @param dato Obtiene el nombre del departamento que corresponde al ID pasado por parametros
   * @returns 
   */
  departamentoUsuario(dato : number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<any>(this.ruta_nombre_departamento+dato,httpOptions);  
  }

  /**
   * 
   * @returns funcion que obtiene la lista de todos los perfiles de usuario
   */
  perfilesUsuarios():Observable<Perfil[]>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<Perfil[]>(this.ruta_perfiles,httpOptions);
  }

  tecnicosDisponibles():Observable<Usuario[]>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<Usuario[]>(this.ruta_tecnicos_disponibles,httpOptions);
  }

  /**
   * funcion que rescata todos los departamentos de la base de datos
   * @returns 
   */
  departamentosUsuarios():Observable<Departamento[]>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<Departamento[]>(this.ruta_departamentos,httpOptions);
  }

  /**
   * Obtiene el nombre del técnico que corresponde al ID pasado por parámetros
   * @param idTecnico 
   * @returns 
   */
  nombreUsuario(idUsuario: number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }
    return this.http.get<any>(this.ruta_nombre_tecnico+idUsuario,httpOptions);
  }

  /**
   * funcion que activa un usuario por su id 
   * @param id 
   * @returns 
   */
  activarUsuario(id : number):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }
    return this.http.get<any>(this.ruta_activar_usuario+id,httpOptions);
  }

  /**
   * funcion que elimina aquel usuario con id
   * @param id 
   * @returns 
   */
  delUsuario(id: number):Observable<any>
  {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'multipart/form-data'
        })
      }

    return this.http.delete<any>(this.ruta_eliminar_usuario+id, httpOptions);
  }

  /**
   * funcion que imprime en pdf la lista de usuarios mostrado por pantalla
   * @param usuarios 
   * @returns 
   */
  imprimirPDF(usuarios : {}):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }

    return this.http.post<any>(this.ruta_imprimir_pdf,usuarios,httpOptions);
  }

  /**
   * descarga los usuarios en excel
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

  /**
   * desactiva un usuario por su id
   * @param id 
   * @returns 
   */
  desactivarUsuario(id: number):Observable<any>
  {
      const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
      })
    }

    return this.http.get<any>(this.ruta_desactivar+id, httpOptions);
  }

}
