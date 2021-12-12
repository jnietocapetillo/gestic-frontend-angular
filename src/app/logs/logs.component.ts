import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import html2canvas from 'html2canvas';
import { Logs } from '../modelos/logs';
import { LogsService } from '../servicios/logs.service';
import { UsuarioService } from '../servicios/usuario.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  lista_logs : Array<Logs> = new Array<Logs>();
  Lista_temporal : Array<Logs> = new Array<Logs>();
  ordenUsuario : number = 0;
  ordenOperacion : number = 0;

  log : Logs = new Logs();
  operaciones : Array<String> = new Array<String>();

  formFiltros = this.formB.group({
    mostrar : [''],
    operacion : ['']
  });

  public page : number = 0;

  public por_paginas : number = this.formFiltros.value['mostrar'];

  constructor(private formB: FormBuilder, private logsInyectado: LogsService, private usuarioInyectado : UsuarioService) { }

  ngOnInit(): void {
    this.inicializar();
    this.formFiltros.controls['mostrar'].setValue('5');
    this.formFiltros.controls['operacion'].setValue('todos');
    this.cambiarPaginas();
  }

  inicializar()
  {
    localStorage.removeItem('logs');
    //llamamos para sacar los logs del sistema
    this.logsInyectado.listado().subscribe(( datosDevueltos => {
      
      if (datosDevueltos.resultado == 200)
      {  
        this.lista_logs = datosDevueltos.datos;
        localStorage.setItem('logs',JSON.stringify(this.lista_logs));
        datosDevueltos.datos.forEach(element => {
          this.log.id = element.id;
          this.log.tipo_acceso = element.tipo_acceso;
          this.log.fecha = element.fecha;
          this.log.idusuario = element.idusuario;

          if (!this.operaciones.includes(this.log.tipo_acceso))
            this.operaciones.push(this.log.tipo_acceso);
            
        });
         
      }
    }));


  }

  ponerFiltroOperacion()
  {
    this.lista_logs = [];
    this.Lista_temporal = JSON.parse(localStorage.getItem('logs') || 'Default Value');
    
    if (this.formFiltros.value['operacion'] != 'todos')
    { 
        this.Lista_temporal.forEach(element => {
          
          if (element.tipo_acceso == this.formFiltros.value['operacion'])
          {
            this.lista_logs.push(element);
          }
        });
    }
    else
    {
      this.lista_logs = this.Lista_temporal;
    }  
  }

  cambiarPaginas()
  {
    this.por_paginas = this.formFiltros.value['mostrar'];
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
        
        PDF.save('listado_logs.pdf');
    });     
  }

  /**
   * funcion que ordena por el campo nombre
   */
  ordenarXusuario()
  {
    if (this.ordenUsuario == 0)
    {
        this.lista_logs.sort(function (a, b) {
        // A va primero que B
        if (a.idusuario < b.idusuario)
            return 1;
        // B va primero que A
        else if (a.idusuario > b.idusuario)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
    else
    {
        this.lista_logs.sort(function (a, b) {
        // A va primero que B
        if (a.idusuario > b.idusuario)
            return 1;
        // B va primero que A
        else if (a.idusuario < b.idusuario)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenUsuario == 0) this.ordenUsuario = 1;
    else this.ordenUsuario = 0;
  }

  /**
   * funcion que ordena por el campo operacion
   */
  ordenarXoperacion()
  {
    if (this.ordenOperacion == 0)
    {
        this.lista_logs.sort(function (a, b) {
        // A va primero que B
        if (a.tipo_acceso < b.tipo_acceso)
            return 1;
        // B va primero que A
        else if (a.tipo_acceso > b.tipo_acceso)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
    else
    {
        this.lista_logs.sort(function (a, b) {
        // A va primero que B
        if (a.tipo_acceso > b.tipo_acceso)
            return 1;
        // B va primero que A
        else if (a.tipo_acceso < b.tipo_acceso)
            return -1;
        // A y B son iguales
        else 
            return 0;
        });
    }
      

    if (this.ordenOperacion == 0) this.ordenOperacion = 1;
    else this.ordenOperacion = 0;
  }

}
