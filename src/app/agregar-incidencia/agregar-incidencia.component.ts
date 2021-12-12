import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Incidencia } from '../modelos/incidencia';
import { Mensaje } from '../modelos/mensaje';
import { IncidenciaService } from '../servicios/incidencia.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';
import { Perfil } from '../modelos/perfil';
import { Imagen } from '../modelos/imagen';
import { archivo } from '../modelos/archivo';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { Email } from '../modelos/email';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-agregar-incidencia',
  templateUrl: './agregar-incidencia.component.html',
  styleUrls: ['./agregar-incidencia.component.css']
})
export class AgregarIncidenciaComponent implements OnInit {

  fecha = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  
  archivo : archivo = new archivo();
  incidencia : Incidencia = new Incidencia();
  mensaje_insertado : Mensaje = new Mensaje();
  perfiles : Array<Perfil> = new Array<Perfil>();
  departamento_usuario : string ='';
  email : Email = new Email();
  //para subir imagen

  public Editor = ClassicEditor;
  public editorData :string = '<p>es una prueba</p>';
  
  formAddIncidencia = this.formBuilder.group({
    titulo:['', Validators.required],
    departamento:[''],
    estado_mostrar:[{value:'Espera', disabled: true}],
    estado:[{value:'Espera'}],
    descripcion:['', Validators.required],
    fecha : [this.fecha],
    imagen : ['']
  });

  constructor(public usuarioInyectado: UsuarioService, private incidenciaInyectada : IncidenciaService, private formBuilder: FormBuilder, private router:Router, private mensaje : MensajeService, private emailInyectado : EnviosEmailService) {
    
 }
  

  ngOnInit(): void {
    //cargamos los datos necesarios de departamento del usuario

    this.usuarioInyectado.departamentoUsuario(this.usuarioInyectado.usuario.idDepartamento).subscribe((datosDevueltos => {
        
        this.formAddIncidencia.controls['departamento'].setValue(datosDevueltos);
       
    }));
    
  }

  /**
   * funcion que agrega una nueva incidencia
   */
  addIncidencia()
  {
    //averiguo el id del usuario sin tecnico
    
    this.usuarioInyectado.nombrePerfilUsuario('Sin tecnico').subscribe((datoDevuelto=>{
      this.usuarioInyectado.idPerfilUsuario(datoDevuelto.id).subscribe((datoDevuelto => {
          //rellenamos la nueva incidencia con los datos del formulario
        this.incidencia.idusuario = this.usuarioInyectado.usuario.idusuario;
        this.incidencia.tecnico_asignado = datoDevuelto.id;
        this.incidencia.fecha = this.formAddIncidencia.value['fecha'];
        this.incidencia.prioridad = 0;
        this.incidencia.estado = 'Espera';
        this.incidencia.titulo = this.formAddIncidencia.value['titulo'];
        this.incidencia.departamento = this.formAddIncidencia.value['departamento'];
        this.incidencia.descripcion = this.formAddIncidencia.value['descripcion'];
          
          //agregamos la incidencia
          this.incidenciaInyectada.addIncidencia(this.incidencia).subscribe((datosDevueltos =>{
            
            if (datosDevueltos.estado == 200)
            {
                const nombreAdmin = 'Administrador';
                //enviamos mensaje al administrador para que asigne la nueva incidencia al tecnico
                //debemos averiguar que id tiene el usuario administrador
                this.usuarioInyectado.nombrePerfilUsuario(nombreAdmin).subscribe((datoDevuelto =>{
                    if (datoDevuelto.estado != 201)
                    {
                      //tenemos el id del perfil del administrador buscamos su idusuario para mandar el mensaje
                      this.usuarioInyectado.idPerfilUsuario(datoDevuelto.id).subscribe((respuesta => {         
                      this.mensaje_insertado.idusuario_receptor = respuesta.id;
                      this.mensaje_insertado.idusuario_origen = this.usuarioInyectado.usuario.idusuario;
                      this.mensaje_insertado.idincidencia = datosDevueltos.incidencia.idincidencia;
                      localStorage.setItem('incidencia',datosDevueltos.incidencia.idincidencia.toString());
                      this.mensaje_insertado.fecha = datosDevueltos.incidencia.fecha;
                      this.mensaje_insertado.descripcion = 'Incidencia creada. Asignar técnico y prioridad';
                      this.mensaje_insertado.imagen = '';
                      this.mensaje_insertado.leido = 0;
                      //agregar mensaje
                      this.mensaje.addMensaje(this.mensaje_insertado).subscribe((nuevoMensaje => {   
                          if (nuevoMensaje == 200)
                          {
                              //se ha insertado el mensaje
                          }
                          else
                          {
                              Swal.fire({
                                  title: 'Error!',
                                  text: 'No se ha podido enviar el mensaje',
                                  icon: 'error',
                                  confirmButtonText: 'OK'
                              });
                          }
                      }));
                      }));
                    }
                }));
                Swal.fire({
                          position: 'center',
                          icon: 'success',
                          title: 'Incidencia creada',
                          showConfirmButton: true,
                        });
                //una vez creada la incidencia subimos fichero en caso que lo haya
                    if (this.archivo.nombreArchivo!='')
                    {
                      this.incidenciaInyectada.addImagenIncidencia(this.archivo).subscribe((datosDevueltos=>{
                          
                          if (datosDevueltos == 200)
                          {
                              Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Se ha guardado la imagen',
                                    showConfirmButton: true,
                              });
                          }
                      }));
                    }
                  //enviamos email al usuario
                  this.enviarEmail();
            }
            else
            {
              Swal.fire({
                  title: 'Error!',
                  text: 'No se ha podido crear la incidencia',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
            }
            this.router.navigate(['incidencias']);
          }));
        }));
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
    //datos para enviar al email
    this.email.tipo = 3;
    let incidencia = localStorage.getItem('incidencia');
    this.email.incidencia = parseInt(incidencia || 'Default Value');
    localStorage.removeItem('incidencia');
    this.email.para = this.usuarioInyectado.usuario.email;
    this.email.usuario = this.usuarioInyectado.usuario.nombre+' '+this.usuarioInyectado.usuario.apellidos;
    this.email.email = this.usuarioInyectado.usuario.email;

    this.emailInyectado.email_usuario(this.email).subscribe((datosDevueltos => {
      if (datosDevueltos.resultado == 200)
      {
          Swal.fire({
                position: 'center',
                icon: 'success',
                title: datosDevueltos.mensaje,
                showConfirmButton: true,
          });
      }
      else
      {
          Swal.fire({
              title: 'Error!',
              text: 'No se ha podido enviar Email',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
    }));
  }

}
