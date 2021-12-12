import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Departamento } from '../modelos/departamento';
import { Perfil } from '../modelos/perfil';
import { Usuario } from '../modelos/usuario';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios : Array<Usuario> = new Array<Usuario>(); 
  usuarios_temporal : Array<Usuario> = new Array<Usuario>();

  perfiles : Array<Perfil> = new Array<Perfil>();
  departamentos : Array<Departamento> = new Array<Departamento>();

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

  crearPdf()
  {
    let DATA = document.getElementById('imprimir')!;
      
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save('usuarios.pdf');
    });     
  }

  /**
   * funcion que elimina un usuario
   * @param id 
   */
  deleteUsuario(id: number)
  {
      Swal.fire({
        title: '¿Estas seguro de querer eliminar permanentemente?',
        text: "Se borrará junto con las incidencias asociadas",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {

          //borramos la incidencia
          this.usuarioInyectado.delUsuario(id).subscribe((datosDevueltos => {
              if (datosDevueltos == 200)
              {
                Swal.fire(
                  'Eliminado!',
                  'Se ha eliminado el usuario',
                  'success'
                )
                this.ngOnInit();
              }
              else
              {
                  Swal.fire(
                  'Eliminación!',
                  'No se ha podido eliminar usuario',
                  'error'
                )
              }
          }))
          
        }
      })
  }
  
}
