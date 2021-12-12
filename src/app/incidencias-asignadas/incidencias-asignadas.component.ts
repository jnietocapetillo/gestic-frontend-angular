import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Incidencia } from '../modelos/incidencia';
import { IncidenciaService } from '../servicios/incidencia.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-incidencias-asignadas',
  templateUrl: './incidencias-asignadas.component.html',
  styleUrls: ['./incidencias-asignadas.component.css']
})
export class IncidenciasAsignadasComponent implements OnInit {

  incidencias : Array<Incidencia> = new Array<Incidencia>(); //declaramos un array de incidencias donde guardamos las incidencias del usuario
  incidenciasTemporal : Array<Incidencia> = new Array<Incidencia>();
  temporal : Array<Incidencia> = new Array<Incidencia>();
  ordenFecha : number = 0;
  ordenEstado : number = 0;
  public page : number = 0;

  formulario = this.formB.group({
    mostrar :['3'],
    estado :['Todos']
  });

  public por_paginas : number = this.formulario.value['mostrar'];

  constructor(private formB: FormBuilder, public incidenciaInyectado: IncidenciaService, public usuarioInyectado : UsuarioService) { }

  ngOnInit(): void {
    this.inicializarIncidencias();
  }

  inicializarIncidencias()
  {
    //cargamos las incidenicas del usuario logueado
    
    this.incidenciaInyectado.incidenciasTecnico(this.usuarioInyectado.usuario.idusuario).subscribe((incidenciasDesdeApi)=> {

        if (incidenciasDesdeApi.estado == 200)
        {
              console.log(incidenciasDesdeApi.datos);
              
              this.incidencias = incidenciasDesdeApi.datos;
              this.incidenciasTemporal = incidenciasDesdeApi.datos;
        }
    }); 
  }

  /**
   * funcion que cambia el numero de elementos por paginas en paginacion
   */
  cambiarPaginas()
  {
    this.por_paginas = this.formulario.value['mostrar'];
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
   * funcion que ordena por el campo fecha
   */
  ordenarXfecha()
  {
    if (this.ordenFecha == 0)
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
      

    if (this.ordenFecha == 0) this.ordenFecha = 1;
    else this.ordenFecha = 0;
  }

  /**
   * funcion que ordena por el campo estado
   */
  ordenarXestado()
  {
    if (this.ordenEstado == 0)
    {
        this.incidencias.sort(function (a, b) {
        // A va primero que B
        if (a.estado < b.estado)
            return 1;
        // B va primero que A
        else if (a.estado > b.estado)
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
        if (a.estado > b.estado)
            return 1;
        // B va primero que A
        else if (a.estado < b.estado)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenEstado == 0) this.ordenEstado = 1;
    else this.ordenEstado = 0;
  }

}
