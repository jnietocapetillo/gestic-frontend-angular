import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Email } from '../modelos/email';
import { Mensaje } from '../modelos/mensaje';
import { UpdateIncidencia } from '../modelos/updateIncidencia';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { IncidenciaService } from '../servicios/incidencia.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-update-incidencia',
  templateUrl: './update-incidencia.component.html',
  styleUrls: ['./update-incidencia.component.css']
})
export class UpdateIncidenciaComponent implements OnInit {

  formulario = this.formB.group({
    prioridad : [''],
    estado :[''],
    descripcion :['']
  });
  idIncidencia : number = 0;
  mensajes : Array<Mensaje> = new Array<Mensaje>();
  cambios : boolean = false;
  prioridades = [0,1,2,3];
  estados = ['Abierta','Resolucion','Espera','Cerrada'];
  email : Email = new Email();

  constructor(public incidenciaInyectable: IncidenciaService, private formB: FormBuilder, private rutaActiva: ActivatedRoute, private mensajeInyectado : MensajeService, private usuarioInyectado : UsuarioService, private emailInyectado : EnviosEmailService) { }

  ngOnInit(): void {
      //iniciamos los datos correspondientes a la incidencia
      this.idIncidencia = this.rutaActiva.snapshot.params.id;
      this.incidenciaInyectable.detalleIncidencia(this.idIncidencia).subscribe(( datosDevueltos => {
          if (datosDevueltos.mensaje==200)
          {
            this.incidenciaInyectable.incidencia=datosDevueltos.datos;
            this.formulario.controls['prioridad'].setValue(this.incidenciaInyectable.incidencia.prioridad);
            this.formulario.controls['estado'].setValue(this.incidenciaInyectable.incidencia.estado);
            this.formulario.controls['descripcion'].setValue(this.incidenciaInyectable.incidencia.descripcion);
          }

      }));
      this.mensajesIncidencias();
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

  /** Funcion que recoge los datos si han cambiado de descripcion */
  cambioDescripcion()
  {
    this.cambios = true;

  }

  /** funcion que recoge los cambios en el estado de la incidencia */
  cambioEstado()
  {
    this.cambios = true;
    //enviamos el email de cambio de estado de la incidencia
    this.email.tipo = 6;
    //sacamos el email del idusuario de la incidencia
    this.usuarioInyectado.detalleUsuario(this.idIncidencia).subscribe(( respuesta => {
        this.email.para = respuesta.datos.email;
        this.email.estado = this.formulario.value['estado'];
        //enviamos el email
        this.emailInyectado.email_usuario(this.email).subscribe((respuesta => {}));
    }))
    
  }

  /** funcion que recoge si cambia el estado de prioridad */
  cambioPrioridad()
  {
    this.cambios = true;
  }

  actualizar()
  {
    if (this.cambios)
    {
      const datos : UpdateIncidencia = new UpdateIncidencia();
      datos.descripcion = this.formulario.value['descripcion'];
      datos.estado = this.formulario.value['estado'];
      console.log(this.formulario.value['estado']);
      
      datos.prioridad = this.formulario.value['prioridad'];
      datos.idincidencia = this.idIncidencia;
      //si hay algun cambio actualizamos la incidencia
      this.incidenciaInyectable.incidenciaUpdate(datos).subscribe((datoDevuelto => {
        if (datoDevuelto == 200)
        {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha actualizado la incidencia',
            showConfirmButton: true,
          });
        }
        else
        {
            Swal.fire({
                title: 'Error!',
                text: 'No se ha podido actualizar la incidencia',
                icon: 'error',
                confirmButtonText: 'OK'
            });

        }
      }));
    }
    else{
      Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'No existen cambios para actualizar',
            showConfirmButton: true,
          });
    }
  }
}
