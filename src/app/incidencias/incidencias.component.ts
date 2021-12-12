import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { Incidencia } from '../modelos/incidencia';
import { IncidenciaService } from '../servicios/incidencia.service';
import { UsuarioService } from '../servicios/usuario.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {
  
  incidencias : Array<Incidencia> = new Array<Incidencia>(); //declaramos un array de incidencias donde guardamos las incidencias del usuario
  incidenciasTemporal : Array<Incidencia> = new Array<Incidencia>();
  incidenciasAntesNombreTecnicos : Array<Incidencia> = new Array<Incidencia>();
  temporal : Array<Incidencia> = new Array<Incidencia>();
  tecnicos : string[] = [];
  listaTecnicos : string[] = [];
  ordenCreada : number = 0;
  ordenTitulo : number = 0;
  ordenTecnico : number = 0;

  public page : number = 0;

  formulario = this.formB.group({
    mostrar :['6'],
    xtecnico : ['Todos'],
    estado :['Todos']
  });

  public por_paginas : number = this.formulario.value['mostrar'];
  
  constructor(public usuarioInyectado : UsuarioService, private ruta:Router, public incidenciaInyectado: IncidenciaService, private formB: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarIncidencias();
  }
    

  inicializarIncidencias()
  {
    //pedimos los datos a API para poder mostrar la lista de incidencias del usuario logueado que tenemos a traves del
    //servicio usuarioInyectado
    //ponemos subscribe a la funcion listado de incidencias
    
    //comprobamos si soy administrador o no
    if (this.usuarioInyectado.usuario.nombrePerfil=="Administrador")
    {
        this.incidenciaInyectado.listadoIncidencias().subscribe((incidenciasDesdeApi)=> {
              this.incidencias = incidenciasDesdeApi;
              this.incidenciasTemporal = incidenciasDesdeApi;          
              this.incidencias.forEach(element => {
                  this.usuarioInyectado.nombreUsuario(element.tecnico_asignado).subscribe(( nombre =>{
                      element.tecnico_asignado = nombre;
                      this.tecnicos.push(nombre);
                    
                      for(var i = 0; i < this.tecnicos.length; i++) {
                        const elemento = this.tecnicos[i];

                        if (!this.listaTecnicos.includes(this.tecnicos[i])) {
                          this.listaTecnicos.push(elemento);
                        }
                      }
                  }));
              });      
        }); 
    }
    else
    {
        this.incidenciaInyectado.incidenciasUsuario(this.usuarioInyectado.usuario.idusuario).subscribe((incidenciasDesdeApi)=> {
              this.incidencias = incidenciasDesdeApi;
              this.incidenciasTemporal = incidenciasDesdeApi;          
              this.incidencias.forEach(element => {
                  this.usuarioInyectado.nombreUsuario(element.tecnico_asignado).subscribe(( nombre =>{
                      element.tecnico_asignado = nombre;

                      this.tecnicos.push(nombre);
                      for(var i = 0; i < this.tecnicos.length; i++) {
                        const elemento = this.tecnicos[i];

                        if (!this.listaTecnicos.includes(this.tecnicos[i])) {
                          this.listaTecnicos.push(elemento);
                        }
                      }
                  }));
              });      
        }); 
    }
  }

  /**
   * funcion que cambia el numero de elementos por paginas en paginacion
   */
  cambiarPaginas()
  {
    this.por_paginas = this.formulario.value['mostrar'];
  }

  /**
   * funcion que limita la lista de incidencias al tecnico asignado
   */  
  ponerFiltroTecnico()
  {
      this.incidencias = this.incidenciasTemporal;
      //cogemos el valor del select de tecnico
      let nombreTecnico : string = this.formulario.value['xtecnico'];
      
      if (nombreTecnico != 'Todos')
      {
          for (let i=0 ; i < this.incidencias.length ; i++)
          {
            if (this.incidencias[i].tecnico_asignado.toString() == nombreTecnico)
              this.temporal.push(this.incidencias[i]) ;
              
          }
          this.incidencias = this.temporal;
          this.temporal = [];
      }
  }

  /**
   * funcion que filtra las incidencias por el estado en el que se encuentra
   */
  ponerFiltroEstado()
  {
    this.incidencias = this.incidenciasTemporal;
    //cogemos el dato que nos viene del select estado
    let estado : string = this.formulario.value['estado'];

    if (estado != 'Todos')
    {
      for (let i=0; i< this.incidencias.length ; i++)
      {
        if (this.incidencias[i].estado == estado)
          this.temporal.push(this.incidencias[i]);
      }

      this.incidencias = this.temporal;
      this.temporal=[];
    }
  }

  
  /**
    funcion que nos envía a borrar la incidencia seleccionada
   */
  deleteIncidencia(id : number)
  {
      Swal.fire({
        title: '¿Estas seguro de querer eliminar permanentemente?',
        text: "Se borrará junto con los mensajes asociados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {

          //borramos la incidencia
          this.incidenciaInyectado.delIncidencia(id).subscribe((datosDevueltos => {
              
              if (datosDevueltos == 200)
              {
                Swal.fire(
                  'Eliminado!',
                  'Se ha eliminado la incidencia',
                  'success'
                )
                this.ngOnInit();
              }
              else
              {
                  Swal.fire(
                  'Eliminación!',
                  'No se ha podido eliminar incidencia',
                  'error'
                )
              }
          }))
          
        }
      })
  }

  /**
   * imprime en pdf la vista actual
   */

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
        
        PDF.save('listado_incidencias.pdf');
    });     
  }

  /**
   * funcion que ordena la tabla por el campo fecha creacion
   */
  ordenarXcreada()
  {
      if (this.ordenCreada == 0)
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.fecha < b.fecha)
            return 1;
        // B va primero que A
        else if (a.fecha > b.fecha)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
    else
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.fecha > b.fecha)
            return 1;
        // B va primero que A
        else if (a.fecha < b.fecha)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenCreada == 0) this.ordenCreada = 1;
    else this.ordenCreada = 0;
  }

  /**
   * funcion que ordena la tabla por el campo titulo
   */
  ordenarXtitulo()
  {
      if (this.ordenTitulo == 0)
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.titulo < b.titulo)
            return 1;
        // B va primero que A
        else if (a.titulo > b.titulo)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
    else
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.titulo > b.titulo)
            return 1;
        // B va primero que A
        else if (a.titulo < b.titulo)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenTitulo == 0) this.ordenTitulo = 1;
    else this.ordenTitulo = 0;
  }

  /**
   * funcion que ordena la tabla por el campo tecnico
   */
  ordenarXtecnico()
  {
      if (this.ordenTecnico == 0)
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.tecnico_asignado < b.tecnico_asignado)
            return 1;
        // B va primero que A
        else if (a.tecnico_asignado > b.tecnico_asignado)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
    else
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.tecnico_asignado > b.tecnico_asignado)
            return 1;
        // B va primero que A
        else if (a.tecnico_asignado < b.tecnico_asignado)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenTecnico == 0) this.ordenTecnico = 1;
    else this.ordenTecnico = 0;
  }

}
