import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { archivo } from '../modelos/archivo';
import { Email } from '../modelos/email';
import { Mensaje } from '../modelos/mensaje';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { IncidenciaService } from '../servicios/incidencia.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-mensajeria',
  templateUrl: './mensajeria.component.html',
  styleUrls: ['./mensajeria.component.css']
})
export class MensajeriaComponent implements OnInit {

  mensaje : Mensaje = new Mensaje();
  archivo : archivo = new archivo();
  fecha = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  idIncidencia : number = 0;
  idTecnico : number = 0;
  para : string = '';
  email : Email = new Email();
  enviar : boolean = false;

  public Editor = ClassicEditor;

  constructor(private rutaActiva: ActivatedRoute, private usuarioInyectado: UsuarioService, private incidenciaInyectada : IncidenciaService, private mensajeInyectado : MensajeService, private formB : FormBuilder, private emailInyectado : EnviosEmailService) { }

  formMensaje = this.formB.group ({
    incidencia:[{value:'',disabled:true}],
    para:[{value:'', disabled:true}],
    fecha:[''],
    mensaje:['', Validators.required],
    imagen: ['']
  }) 


  ngOnInit(): void {
    //cogemos el dato pasado por parametro desde mensajes pendientes
    this.idIncidencia = this.rutaActiva.snapshot.params.id;
    this.formMensaje.controls['incidencia'].setValue(this.idIncidencia);
    this.formMensaje.controls['fecha'].setValue(this.fecha);
    //averiguamos si el mensaje es del tecnico o del usuario
    this.incidenciaInyectada.tecnicoIncidencia(this.idIncidencia).subscribe((datoDevuelto1 => {
      
      if (datoDevuelto1.resultado == 200)
      {
        this.idTecnico = datoDevuelto1.datos;

        if (this.idTecnico == this.usuarioInyectado.usuario.idusuario)
        {
            //soy el tecnico de la incidencia, el mensaje es para el usuario de la incidencia
            this.formMensaje.controls['incidencia'].setValue(this.idIncidencia);
            //cogemos el nombre del usuario a traves de su idincidencia
            this.incidenciaInyectada.idUsuarioIdIncidencia(this.idIncidencia).subscribe ((datoDevuelto2 => {  
              if (datoDevuelto2.estado == 200)
              {
                //tenemos el idusuario y obtenemos su nombre
                this.usuarioInyectado.nombreUsuario(datoDevuelto2.datos.idusuario).subscribe((datoDevuelto3 => {  
                    this.formMensaje.controls['para'].setValue(datoDevuelto3);
                    console.log(datoDevuelto3);
                    
                }));
              }
            }));
            this.enviar = true;    
        }
        else
        {
            //soy el usuario y el mensaje es para el técnico
            //tenemos el tecnico asignado y obtenemos su nombre
              this.usuarioInyectado.nombreUsuario(datoDevuelto1.datos).subscribe((datoDevuelto => {
              this.formMensaje.controls['para'].setValue(datoDevuelto);
              }));
        }
      }
    }));
    
  }

  /**
   * agrega un nuevo mensaje a la incidencia
   */
  addMensaje()
  {
     //conseguimos el id del usuario receptor para poder crear el mensaje
     this.incidenciaInyectada.tecnicoIncidencia(this.idIncidencia).subscribe((datoDevuelto1 => {
      if (datoDevuelto1.resultado == 200)
      {
        this.idTecnico = datoDevuelto1.datos;

        if (this.idTecnico == this.usuarioInyectado.usuario.idusuario)
        {
            this.incidenciaInyectada.idUsuarioIdIncidencia(this.idIncidencia).subscribe ((datoDevuelto2 => {
              if (datoDevuelto2.estado == 200)
              {
                  this.mensaje.idusuario_receptor = datoDevuelto2.datos.idusuario;
                  this.mensaje.idusuario_origen = this.usuarioInyectado.usuario.idusuario;
                  this.mensaje.idincidencia = this.idIncidencia;
                  this.mensaje.fecha = this.formMensaje.value['fecha'];
                  this.mensaje.descripcion = this.formMensaje.value['mensaje'];
                  //averguamos email del usuario receptor del mensaje para el email
                    this.usuarioInyectado.detalleUsuario(datoDevuelto2.datos.idusuario).subscribe((respuesta => {
                        localStorage.setItem('email',respuesta.datos.email);
                    }));
                  //insertamos el mensaje
                  this.mensajeInyectado.addMensaje(this.mensaje).subscribe((resultado => {
                    if (resultado == 200)
                    {
                      //se ha insertado el mensaje, vemos si se ha seleccionado una imagen
                      if (this.archivo.nombreArchivo != '')
                      {
                          //cargamos la imagen seleccionada
                          this.mensajeInyectado.addImagenMensaje(this.archivo).subscribe((datosDevueltos=>{
                              if (datosDevueltos == 201)
                              {
                                  Swal.fire({
                                        title: 'Error!',
                                        text: 'No se ha podido guardar la imagen',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    });
                                  
                              }
                          }));
                      }
                            Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: 'Se ha guardado el mensaje',
                              showConfirmButton: true,
                            });
                    }
                  }));
                  if (this.enviar) this.enviarEmail();
              }
              })); 
          }
          else 
          {
              this.incidenciaInyectada.tecnicoIncidencia(this.idIncidencia).subscribe((datoDevuelto3 => {
                    this.mensaje.idusuario_receptor = datoDevuelto3.datos;
                    this.mensaje.idusuario_origen = this.usuarioInyectado.usuario.idusuario;
                    this.mensaje.idincidencia = this.idIncidencia;
                    this.mensaje.fecha = this.formMensaje.value['fecha'];
                    this.mensaje.descripcion = this.formMensaje.value['mensaje'];
                  //insertamos el mensaje
                  this.mensajeInyectado.addMensaje(this.mensaje).subscribe((resultado => {
                    if (resultado == 200)
                    {
                      //se ha insertado el mensaje, vemos si se ha seleccionado una imagen
                      if (this.archivo.nombreArchivo != '')
                      {
                          //cargamos la imagen seleccionada
                          this.mensajeInyectado.addImagenMensaje(this.archivo).subscribe((datosDevueltos=>{
                              if (datosDevueltos == 201)
                              {
                                  Swal.fire({
                                        title: 'Error!',
                                        text: 'No se ha podido guardar la imagen',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    });
                                  
                              }
                          }));
                      }
                            Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: 'Se ha guardado el mensaje',
                              showConfirmButton: true,
                            });
                    }
                  }));
              }));
          }
      }
      }));           
  }

  /**
   * funcion que extrae del evento la informacion del fichero seleccionado
   * @param event 
   */
  subirImagen(event: any)
  {
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = file.name;

    if (files && file)
    {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);

    }
  }

  /**
   * funcion que guarda los datos del fichero
   * @param readerEvent 
   */
  handleReaderLoaded(readerEvent: any)
  {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

  enviarEmail()
  {
      //datos para email de nuevo mensaje en incidencia
      this.email.tipo = 4;
      this.email.para = localStorage.getItem('email') || 'Default Value';
      this.email.incidencia = this.idIncidencia;
      this.email.usuario = 'tecnico';

      this.emailInyectado.email_usuario(this.email).subscribe ((datosDevueltos => {
          if (datosDevueltos.resultado == 200)
          {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: datosDevueltos.mensaje,
                showConfirmButton: true,
              });
          }
      }));
  }

}
