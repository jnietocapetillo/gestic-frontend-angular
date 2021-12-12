import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { archivo } from '../modelos/archivo';
import { Departamento } from '../modelos/departamento';
import { Email } from '../modelos/email';
import { enviarEmail } from '../modelos/envioEmail';
import { Mensaje } from '../modelos/mensaje';
import { Perfil } from '../modelos/perfil';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';


@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {

  //creamos el formulario para agregar un nuevo usuario y sus validaciones
  ListaDepartamentos : Array<Departamento> = new Array<Departamento>();
  ListaPerfiles: Array<Perfil> = new Array<Perfil>();
  archivo : archivo = new archivo();
  email : Email = new Email();
 

  formAgregarUsuario = this.formBuilder.group({
    nombre:['', [Validators.required, Validators.pattern(/[a-zA-Z]{1,30}/)]],
    apellidos:['', [Validators.required, Validators.pattern(/[a-zA-Z]{1,30}/)]],
    dni:['',[Validators.required, Validators.pattern(/(\d{8})([-]?)([a-zA-Z]{1})/)]],
    email:['',[Validators.required, Validators.pattern(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/)]],
    password: ['',[Validators.required, Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]],
    passwordR: ['',[Validators.required, Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]],
    idDepartamento:['', [Validators.required]],
    idPerfil: ['', Validators.required],
    movil: ['',[Validators.required ,Validators.pattern(/[9|6]{1}([\d]{2}[-]*){3}[\d]{2}/)]],
    domicilio: [''],
    municipio: [''],
    localidad: [''],
    avatar:[''],
    codigo_postal:['', [Validators.pattern(/(([1-4][0-9][0-9][0-9][0-9])|(0(?=[1-9][0-9][0-9][0-9]))|(5(?=[0-2][0-9][0-9][0-9])))/)]]

  });
  constructor(private usuarioInyectado:UsuarioService, private formBuilder: FormBuilder, private mensajeInyectado:MensajeService, private router:Router, private emailInyectado : EnviosEmailService) { }

  ngOnInit(): void {

      //sacamos los departamentos
      this.usuarioInyectado.departamentosUsuarios().subscribe((datosDevueltos => {
          this.ListaDepartamentos = datosDevueltos;
      }));
      this.usuarioInyectado.perfilesUsuarios().subscribe((datosDevueltos => {
          datosDevueltos.forEach(element => {
            if ((element.nombre != 'Administrador') && (element.nombre != 'Sin tecnico'))
            {
              this.ListaPerfiles.push(element);
            }
          });
      }));
      this.formAgregarUsuario.controls['avatar'].setValue("usuarioH.jpg");
      
  }

  /**
   * funcion que recoge los datos del usuario para agregarlo
   */
  agregarUsuario()
  {
    //una vez validado lo primero es comprobar que las contraseñas son iguales
    if (this.formAgregarUsuario.value['password'] == this.formAgregarUsuario.value['passwordR'])
    {
        
        //enviamos a la API para insertar el nuevo usuario
        const datosUsuarios = this.formAgregarUsuario.value;
        
        this.usuarioInyectado.addUsuario(datosUsuarios).subscribe((datosDevueltos =>{
            
            if (datosDevueltos.estado == 200 ){
                //comprobamos si hay archivo para subir
                if (this.archivo.nombreArchivo != ' ')
                {
                  this.usuarioInyectado.addImagenUsuario(this.archivo).subscribe((datosDevueltos =>{
                      if (datosDevueltos == 201)
                      {
                        Swal.fire({
                            title: 'Error!',
                            text: 'No se ha podido guardar la imagen',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });                             
                      }
                      else
                      {
                          Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Usuario creado',
                            showConfirmButton: true,
                          });
                        this.enviarEmail();
                        this.router.navigate(['']);
                      }
                  }));
                }
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Usuario creado',
                    showConfirmButton: true,
                });
                this.crearMensaje();
                    
            }
            else if(datosDevueltos.estado ==202){
                Swal.fire({
                    title: 'Error!',
                    text: 'Ya existe un usuario con ese email',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            else if (datosDevueltos.estado == 201){
                Swal.fire({
                    title: 'Error!',
                    text: 'No se ha podido crear el usuario',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }));
    }
    else
    {
      Swal.fire({
            title: 'Error!',
            text: 'Las contraseñas no coinciden',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
  }

  /**
   * funcion que crea mensaje para el administrador
   */
  crearMensaje()
  {
      let mensaje = new Mensaje();
      let email : enviarEmail = new enviarEmail;
      let fecha = new Date().toISOString().slice(0, 19).replace('T', ' '); 

      this.usuarioInyectado.nombrePerfilUsuario('Administrador').subscribe((datoDevuelto => {
          this.usuarioInyectado.idPerfilUsuario(datoDevuelto.id).subscribe((respuesta => {
            if (respuesta.id != 201) mensaje.idusuario_receptor = respuesta.id;
          }));
          email.email = this.formAgregarUsuario.value['email'];
          this.usuarioInyectado.idUsuario(email).subscribe((respuesta => {
              mensaje.idusuario_origen = respuesta;
              mensaje.descripcion = 'Usuario dado de alta e inactivo. Revisar.';
              this.mensajeInyectado.addMensaje(mensaje).subscribe((datoDevuelto =>{
                if (datoDevuelto == 200)
                {
                  this.router.navigate(['']);
                }
                else    
                {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Se ha creado el usuario pero no se ha podido enviar aviso a Administrador',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
              }));
          }));
      }))
      
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
    this.email.tipo = 1;
    this.email.asunto = 'Alta Usuario';
    this.email.para = this.formAgregarUsuario.value['email'];
    this.email.email = this.formAgregarUsuario.value['email'];
    this.email.password = this.formAgregarUsuario.value['password'];

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
        else if (datosDevueltos.resultado == 201)
        {
             Swal.fire({
                title: 'Error!',
                text: datosDevueltos.mensaje,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }));
  }
}
