import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incidencia } from '../modelos/incidencia';
import { Mensaje } from '../modelos/mensaje';
import { IncidenciaService } from '../servicios/incidencia.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-detalle-incidencia',
  templateUrl: './detalle-incidencia.component.html',
  styleUrls: ['./detalle-incidencia.component.css']
})
export class DetalleIncidenciaComponent implements OnInit {

  incidenciaUsuario : Incidencia = new Incidencia();
  idIncidencia : number = 0;
  mensajes  : Array<Mensaje> = new Array<Mensaje>();
  nombreTecnico : string = '';
  usuarioOrigen : String[] = new Array();
  departamento: string='';
  

  constructor(public incidenciaInyectada: IncidenciaService, public usuarioInyectado: UsuarioService, private rutaActiva: ActivatedRoute, private mensajeInyectado: MensajeService) { }

  ngOnInit(): void {
      this.idIncidencia = this.rutaActiva.snapshot.params.id;
      this.cargarIncidencia();
      this.mensajesIncidencias();
  }

  cargarIncidencia()
  {
    this.incidenciaInyectada.detalleIncidencia(this.idIncidencia).subscribe((incidenciaDevuelta => {   
        if (incidenciaDevuelta.mensaje == 200)
        {
          this.incidenciaUsuario = incidenciaDevuelta.datos;console.log(this.incidenciaUsuario.imagen);
          
          this.usuarioInyectado.nombreUsuario(this.incidenciaUsuario.tecnico_asignado).subscribe(( nombre =>{
                 this.nombreTecnico = nombre;
          }));

        }
        else
        {
            //error
        }
        
    }));
    
  }

  /**
   * funcion que extrae los mensajes asociados a la incidencia
   */
  mensajesIncidencias()
  {
    let indice : number =0;
    this.mensajeInyectado.mensajesIncidencias(this.idIncidencia).subscribe(( mensajesDevueltos => {
        if (mensajesDevueltos.estado == 200)
        {
            this.mensajes = mensajesDevueltos.datos;
          this.mensajes.forEach(element => {
            this.usuarioInyectado.nombreUsuario(element.idusuario_origen).subscribe(( nombre =>{
                  element.nombre_origen=nombre;
          }));
              
          });       
        }      
    }));            
  }

}
