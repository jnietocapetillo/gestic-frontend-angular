import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Email } from '../modelos/email';
import { Mensaje } from '../modelos/mensaje';
import { Usuario } from '../modelos/usuario';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { IncidenciaService } from '../servicios/incidencia.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {

  
  constructor(public usuarioInyectado: UsuarioService, private mensajeInyectado: MensajeService, public incidenciaInyectada: IncidenciaService, private router: Router, private emailInyectado : EnviosEmailService) { }

  mensajes : Array<Mensaje> = new Array<Mensaje>();
  usuarioLogueado : Usuario = new Usuario();
  usuarioLogin : Usuario = new Usuario();
  email: Email = new Email();

  ngOnInit(): void {
    //llamamos a conocer los mensajes del usuario que se ha logado
    this.mensajes=[];
    this.mensajesUsuario();
    this.usuarioLogin = JSON.parse(sessionStorage.getItem('usuario') || 'Default Value');
    
  }

  /** funcion que recoge los mensajes del usuario que ha iniciado sesion */
  mensajesUsuario()
  {
        this.mensajeInyectado.mensajesNoLeidos(this.usuarioInyectado.usuario.idusuario).subscribe((datosDevueltos =>{
            if (datosDevueltos.mensaje == 200)
            {      
              this.mensajes = datosDevueltos.datos;
              //mostramos los nombres
              this.mensajes.forEach(element => {
                  this.usuarioInyectado.detalleUsuario(element.idusuario_origen).subscribe((nombre =>{
                      element.nombre_origen = nombre.datos.nombre+' '+nombre.datos.apellidos;
                  }));
              });
            }
        }));
  }

  /**
   * funcion que marca un mensaje no leido como leido
   * @param idmensaje 
   * @param mensaje 
   */
  marcarLeido(idmensaje :number, mensaje : Mensaje)
  {
    this.mensajeInyectado.marcarLeido(idmensaje, mensaje).subscribe((datoDevuelto => {
        console.log(datoDevuelto);
        
        if (datoDevuelto == 200)
        {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Mensaje leido',
            showConfirmButton: true,
          });
          this.mensajes=[];
          this.mensajesUsuario();
        }  
        else 
        {
          Swal.fire({
              title: 'Error!',
              text: 'No se ha podido cambiar a leido',
              icon: 'error',
              confirmButtonText: 'OK'
          });
        }        
    }));
  }

  activarUsuario(idmensaje :number, mensaje : Mensaje)
  {
      Swal.fire({
        title: "Activar Usuario",
        text: "¿Quiere activar el usuario?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Activar",
        cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
            this.usuarioInyectado.activarUsuario(mensaje.idusuario_origen).subscribe((datosDevueltos =>{
              if (datosDevueltos == 200)
                  //marcamos el mensaje como leido
                  this.marcarLeido(idmensaje,mensaje);
                  //enviamos email al usuario
                  //averiguamos el email del usuario origen
                  this.usuarioInyectado.detalleUsuario(mensaje.idusuario_origen).subscribe((respuesta =>{
                      if (respuesta.estado == 200)
                      {
                        this.email.tipo = 2;
                        this.email.para = respuesta.datos.email;
                        this.email.email = respuesta.datos.email;

                        this.emailInyectado.email_usuario(this.email).subscribe((datoDevuelto => {
                        }));
                      }
                  }))
            }));    
        }
    });
  }

  asignarTecnico (mensaje : Mensaje)
  {
      //ir al componente para asignar tecnico y prioridad
      
      this.router.navigate(['incidencia/asignarTecnico/'+mensaje.idincidencia]);
  }
}
