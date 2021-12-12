import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Departamento } from '../modelos/departamento';
import { Mensaje } from '../modelos/mensaje';
import { Perfil } from '../modelos/perfil';
import { Usuario } from '../modelos/usuario';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-desactivar-usuario',
  templateUrl: './desactivar-usuario.component.html',
  styleUrls: ['./desactivar-usuario.component.css']
})
export class DesactivarUsuarioComponent implements OnInit {

  usuarios : Array<Usuario> = new Array<Usuario>(); 
  usuarios_temporal : Array<Usuario> = new Array<Usuario>();

  perfiles : Array<Perfil> = new Array<Perfil>();
  departamentos : Array<Departamento> = new Array<Departamento>();
  mensaje: Mensaje = new Mensaje();

  ordenNombre : number = 0;
  ordenApellidos : number = 0;
  ordenFecha : number = 0;

  formFiltros = this.formB.group({
    mostrar : [''],
    departamento : [''],
    perfil : [''],
    estado : ['']
  });

  public page : number = 0;

  public por_paginas : number = this.formFiltros.value['mostrar'];

  constructor(public usuarioInyectado: UsuarioService, private http: HttpClient, private mensajeInyectado: MensajeService, private formB: FormBuilder) { }

  ngOnInit(): void {
    this.inicializar();
    this.formFiltros.controls['mostrar'].setValue('5');
    this.formFiltros.controls['departamento'].setValue('todos');
    this.formFiltros.controls['perfil'].setValue('todos');
    this.formFiltros.controls['estado'].setValue('todos');
    this.cambiarPaginas();

  }

  inicializar()
  {
      //ponemos un subscribe en la funciones para las consultas
    this.usuarioInyectado.listaUsuarios().subscribe((usuariosDesdeApi) => {
            this.usuarios = usuariosDesdeApi;
            
            this.usuarios.forEach(element => {
                //me traigo los nombres de departamento y perfil
              this.usuarioInyectado.perfilUsuario(element.idPerfil).subscribe((datoDevuelto =>{
                element.nombrePerfil= datoDevuelto;
                  this.usuarioInyectado.departamentoUsuario(element.idDepartamento).subscribe((datoDevuelto => {
                element.nombreDepartamento = datoDevuelto;
                localStorage.setItem('usuarios',JSON.stringify(this.usuarios));
              }));
            }));
            });
          
    });

    this.usuarioInyectado.departamentosUsuarios().subscribe ((respuesta => {
      this.departamentos = respuesta;
    }));

    this.usuarioInyectado.perfilesUsuarios().subscribe (( respuesta =>{
      this.perfiles = respuesta;
    }));
  }

  cambiarPaginas()
  {
    this.por_paginas = this.formFiltros.value['mostrar'];
  }

  ponerFiltroPerfil()
  {
    this.usuarios = [];
    this.usuarios_temporal = JSON.parse(localStorage.getItem('usuarios') || 'Default Value');
    
    if (this.formFiltros.value['perfil'] != 'todos')
    {
        this.usuarios_temporal.forEach(element => {
          if (element.idPerfil == this.formFiltros.value['perfil'])
          {
            this.usuarios.push(element);
          }
        });
    }
    else
    {
      this.usuarios = this.usuarios_temporal;
    }  
  }

  /**
   * funcion que filtra las incidencias por el estado en el que se encuentra
   */
  ponerFiltroDepartamento()
  {
      this.usuarios = [];
      this.usuarios_temporal = JSON.parse(localStorage.getItem('usuarios') || 'Default Value');

      if (this.formFiltros.value['departamento'] != 'todos')
      {
          this.usuarios_temporal.forEach(element => {
            if (element.idDepartamento == this.formFiltros.value['departamento'])
            { 
              this.usuarios.push(element);
            }
          });
      }
      else
      {
        this.usuarios = this.usuarios_temporal;
      }  
  }

  ponerFiltroEstado()
  {
      this.usuarios = [];
      this.usuarios_temporal = JSON.parse(localStorage.getItem('usuarios') || 'Default Value');

      if (this.formFiltros.value['estado'] != 'todos')
      {
          this.usuarios_temporal.forEach(element => {
            if (element.activo == this.formFiltros.value['estado'])
            {
              this.usuarios.push(element);
            }
          });
      }
      else
      {
        this.usuarios = this.usuarios_temporal;
      }  
  }

  /**
   * funcion que ordena por el campo nombre
   */
  ordenarXnombre()
  {
    if (this.ordenNombre == 0)
    {
        this.usuarios.sort(function (a, b) {
        // A va primero que B
        if (a.nombre < b.nombre)
            return 1;
        // B va primero que A
        else if (a.nombre > b.nombre)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
    else
    {
        this.usuarios.sort(function (a, b) {
        // A va primero que B
        if (a.nombre > b.nombre)
            return 1;
        // B va primero que A
        else if (a.nombre < b.nombre)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenNombre == 0) this.ordenNombre = 1;
    else this.ordenNombre = 0;
  }

  /**
   * funcion que ordena por el campo apellidos
   */
  ordenarXapellidos()
  {
    if (this.ordenApellidos == 0)
    {
      this.usuarios.sort(function (a, b) {
      // A va primero que B
      if (a.apellidos < b.apellidos)
          return 1;
      // B va primero que A
      else if (a.apellidos > b.apellidos)
          return -1;
      // A y B son iguales
      else 
          return 0;
      });
    }
    else
    {
        this.usuarios.sort(function (a, b) {
        // A va primero que B
        if (a.apellidos > b.apellidos)
            return 1;
        // B va primero que A
        else if (a.apellidos < b.apellidos)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }

      if (this.ordenApellidos == 0) this.ordenApellidos = 1;
      else this.ordenApellidos = 0;
  }

  /**
   * funcion que ordena por el campo fecha
   */
  ordenarXfecha()
  {
      if (this.ordenFecha == 0)
      {
          this.usuarios.sort(function (a, b) {
          // A va primero que B
          if (a.created_at < b.created_at)
              return 1;
          // B va primero que A
          else if (a.nombre > b.nombre)
              return -1;
          // A y B son iguales
          else 
              return 0;
          });
      }
      else
      {
          this.usuarios.sort(function (a, b) {
          // A va primero que B
          if (a.created_at < b.created_at)
              return 1;
          // B va primero que A
          else if (a.nombre > b.nombre)
              return -1;
          // A y B son iguales
          else 
              return 0;
          });
      }
      

      if (this.ordenFecha == 0) this.ordenFecha = 1;
      else this.ordenFecha = 0;
  }

  desactivarUsuario(id:number)
  { 
      //controlo que no se pueda desactivar ni el usuario con inicio de sesion ni el administrador
      if (id == 1 || id == this.usuarioInyectado.usuario.idusuario)
      {
          Swal.fire({
            icon: 'error',
            title: 'El usuario Administrador NO se puede desactivar',
            text: 'User: admin',
            footer: ''
          });
      }
      else
      {
          Swal.fire({
              title: '¿Estas seguro de querer Desactivar el Usuario?',
              text: "El usuario NO podrá acceder a la aplicación",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si'
            }).then((result) => {
              if (result.isConfirmed) {
                this.usuarioInyectado.desactivarUsuario(id).subscribe((datosDevueltos => {
                    if (datosDevueltos == 200)
                    {
                      Swal.fire(
                        'Correcto!',
                        'Se ha desactivado el usuario',
                        'success'
                      );
                      //enviar mensaje a administrador para activarlo
                      
                      this.mensaje.idusuario_receptor = 1;
                      this.mensaje.idusuario_origen = id;
                      this.mensaje.descripcion = 'Usuario dado de alta e inactivo. Revisar';
                      this.mensaje.idincidencia = 0;
                      this.mensaje.leido = 0;
                      this.mensaje.imagen = '';
                      this.mensajeInyectado.addMensaje(this.mensaje).subscribe((datosDevueltos => {
                        if (datosDevueltos == 200)
                            window.location.reload();
                        else{
                            Swal.fire(
                                'Error!',
                                'No se ha podido enviar mensaje al Administrador',
                                'error'
                              );
                        }
                      }));
                      
                    }
                    else
                    {
                        Swal.fire(
                        'Error!',
                        'No se ha podido desactivar el usuario',
                        'error'
                      )
                    }
                }))
                
              }
            })
      }
  }
}
