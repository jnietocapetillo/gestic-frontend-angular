import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { LoginServiceService } from '../servicios/login-service.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { login } from '../modelos/login';
import { response } from '../modelos/response';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";
import { enviarEmail } from '../modelos/envioEmail';
import { Usuario } from '../modelos/usuario';
import { Mensaje } from '../modelos/mensaje';
import { MensajeService } from '../servicios/mensaje.service';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { Email } from '../modelos/email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  siteKey: string = "6LfMs3gdAAAAACqv3eWXI2s0n2ser-9m-R5xfArH";

  formularioLogin : FormGroup;
  
  loginParaApi: login = new login;
  respuestaApiLogin: response = new response();
  usuario_no_activo:boolean = true;
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;
  email : Email = new Email();

  constructor(private reCaptchaV3Service: ReCaptchaV3Service,public usuarioInyectado : UsuarioService, private loginServicio:LoginServiceService, private router: Router, private authService: SocialAuthService, private mensajeInyectado : MensajeService, private emailInyectado : EnviosEmailService) { 

    this.formularioLogin = new FormGroup({
        'email': new FormControl('',Validators.pattern(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/)),
        'password': new FormControl(),
    //    'password': new FormControl('',Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)),
        'recordar': new FormControl(false)
    });

    
  }

  /**
   * pone los valores dependiendo si tenemos cookies o no
   */
  valoresPorDefecto()
  {
      if (!(this.readCookie('usuario') == 'null'))
      {
        this.formularioLogin.controls['email'].setValue(this.readCookie('usuario'));
        this.formularioLogin.controls['password'].setValue(this.readCookie('password'));
      }
  }

  
  /**
   * funcion que inicia sesion con google +
   */
  signInWithGoogle(): void {
    const result = this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    
  }

  /**
   * cierra la sesion con google +
   
  signOut(): void {
    this.authService.signOut();
  }*/

  /**
   * funcion que recoge los datos del formulario
   */
  recogerDatos()
  {
    this.loginParaApi.email = this.formularioLogin.controls['email'].value;
    this.loginParaApi.password = this.formularioLogin.controls['password'].value;

    if (this.formularioLogin.value['recordar'])
    {
      //creamos las cookies para recordar al usuario si no existe
      if (this.readCookie('usuario') == 'null')
      {
        document.cookie = "usuario =" + this.loginParaApi.email;
        document.cookie = "password =" + this.loginParaApi.password;
      }
      
    }
    else 
    {
      //debemos eliminar si existe la cookie
      document.cookie = "usuario=;";
      document.cookie = "password=;";
    }
    this.enviar();

  }

  ngOnInit(): void {
      let email: enviarEmail = new enviarEmail();

      this.valoresPorDefecto();
      sessionStorage.clear();

       this.authService.authState.subscribe((user) => {
        
        this.user = user;
        this.loggedIn = (user != null);
        email.email = user.email;

        this.usuarioInyectado.idUsuario(email).subscribe(respuesta => {
          
          if (respuesta != 201)
          { 
                  //el usuario se ha logado y lo cargamos en el servicio
                this.usuarioInyectado.detalleUsuario(respuesta).subscribe(( datos => {
                  this.usuarioInyectado.usuario = datos.datos;
               
                if (this.usuarioInyectado.usuario.activo == 1)
                { 
                  this.usuario_no_activo = true;
                  this.usuarioInyectado.perfilUsuario(this.usuarioInyectado.usuario.idPerfil).subscribe((datoDevuelto =>{
                      this.usuarioInyectado.usuario.nombrePerfil = datoDevuelto;

                      this.usuarioInyectado.departamentoUsuario(this.usuarioInyectado.usuario.idDepartamento).subscribe((datoDevuelto => {
                        this.usuarioInyectado.usuario.nombreDepartamento = datoDevuelto;
                        this.usuarioInyectado.usuario.hayUsuario = true;
                        sessionStorage.setItem('usuario',JSON.stringify(this.usuarioInyectado.usuario));
                      }));
                  }));
                      this.router.navigate(['escritorio']);
                }
              }))
            }
            else
            {
              //no esta dado de alta el usuario en la base de datos, lo incluimos
              //primero tenemos que generar una contraseña aleatoria para darle de alta
              let pass : string = '';
              let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
              for (let i =0; i < 8; i++){
                pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);  
              }

              //tomamos los datos que nos proporciona la API google
              const datosUsuario : Usuario = new Usuario();
                
                datosUsuario.nombre = this.user.firstName,
                datosUsuario.apellidos = this.user.lastName,
                datosUsuario.dni = '',
                datosUsuario.email = this.user.email,
                datosUsuario.password = pass,
                datosUsuario.activo =0,
                datosUsuario.idDepartamento = 1,
                datosUsuario.idPerfil = 2,
                datosUsuario.movil = 0,
                datosUsuario.domicilio = '',
                datosUsuario.localidad = '',
                datosUsuario.municipio = '',
                datosUsuario.codigo_postal = 0,
                datosUsuario.avatar = 'usuarioM.jpg'
              

              //insertamos el usuario
              this.usuarioInyectado.addUsuario(datosUsuario).subscribe((datosDevueltos =>{
                
                if (datosDevueltos.estado == 200 ){
                  //debemos enviar mensaje al administrador para que pueda activar el usuario
                  this.crearMensaje(this.user.email, pass);
                }
                else if (datosDevueltos.estado == 201)
                {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se ha podido crear el Usuario. Vuelva a intentarlo.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
              }));
            }
          })
        
        });
      
  }

  /**
   * enviamos mensaje al administrador y email para avisarlo que tiene un usuario para activar
   */
  crearMensaje(emailUsuario : string, password : string)
  {
      let mensaje = new Mensaje();
      let email : enviarEmail = new enviarEmail;

      mensaje.idusuario_receptor = 1; //el administrador
      mensaje.descripcion = 'Usuario dado de alta e inactivo. Revisar.';
      mensaje.idincidencia = 0;
      mensaje.leido = 0;
      mensaje.imagen = '';
      email.email = emailUsuario;
      this.usuarioInyectado.idUsuario(email).subscribe((respuesta => {
          mensaje.idusuario_origen = respuesta;
          
          this.mensajeInyectado.addMensaje(mensaje).subscribe((datoDevuelto =>{
            if (datoDevuelto == 200)
            {
              Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Usuario creado. Deberá ser activado por el Administrador. Se le ha enviado email con sus datos de Acceso.',
                      showConfirmButton: true,
              });

              //enviamos email al usuario dado de alta
              this.email.tipo = 1;
              this.email.email = emailUsuario;
              this.email.para = emailUsuario;
              this.email.password = password;
                
              //enviamos el email
              this.emailInyectado.email_usuario(this.email).subscribe((datosDevueltos => {
                if (datosDevueltos.resultado == 201)
                {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se ha enviado el Email al usuario',
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
                    text: 'Se ha creado el usuario pero no se ha podido enviar aviso a Administrador',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
          }));
      }));
  }


  /**
   * funcion que envia los datos para validar el usuario en la Api
   */
  enviar()
  {
    
    if (!(this.readCookie('usuario') == ''))
    {
        this.loginParaApi.email = this.readCookie('usuario');
        this.loginParaApi.password = this.readCookie('password');
    }
    this.loginServicio.login(this.loginParaApi).subscribe((datosDevueltos) => {
        this.respuestaApiLogin.estado = datosDevueltos.estado;
        this.respuestaApiLogin.datos = datosDevueltos.datos;
        
        if (this.respuestaApiLogin.estado == 200)
        {
            //el usuario se ha logado y lo cargamos en el servicio
            this.usuarioInyectado.usuario = datosDevueltos.datos;
            

            if (this.usuarioInyectado.usuario.activo == 1)
            {
              this.usuario_no_activo = true;
              this.usuarioInyectado.perfilUsuario(this.usuarioInyectado.usuario.idPerfil).subscribe((datoDevuelto =>{
                  this.usuarioInyectado.usuario.nombrePerfil = datoDevuelto;

                this.usuarioInyectado.departamentoUsuario(this.usuarioInyectado.usuario.idDepartamento).subscribe((datoDevuelto => {
                  this.usuarioInyectado.usuario.nombreDepartamento = datoDevuelto;
                  this.usuarioInyectado.usuario.hayUsuario = true;
                  sessionStorage.setItem('usuario',JSON.stringify(this.usuarioInyectado.usuario));
                }));
              }));
              this.router.navigate(['escritorio']);
            }
            else  
              this.usuario_no_activo = false;
              
        }
        else
        {
          Swal.fire({
            title: 'Error!',
            text: 'Datos introducidos erróneos',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
    });

  }

  /**
   * funcion que lee si hay cookie
   * @param name 
   * @returns 
   */
  readCookie(nombre:string) {

      let nameEQ = nombre + "="; 
      let ca = document.cookie.split(';');

      for(var i=0;i < ca.length;i++) {

        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) {
          return decodeURIComponent( c.substring(nameEQ.length,c.length) );
        }

      }

      return 'null';

    }
}
