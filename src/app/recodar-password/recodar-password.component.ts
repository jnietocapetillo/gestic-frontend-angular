import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Email } from '../modelos/email';
import { enviarEmail } from '../modelos/envioEmail';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { UsuarioService } from '../servicios/usuario.service';


@Component({
  selector: 'app-recodar-password',
  templateUrl: './recodar-password.component.html',
  styleUrls: ['./recodar-password.component.css']
})
export class RecodarPasswordComponent implements OnInit {

  email : Email = new Email();

  constructor(private emailInyectado : EnviosEmailService, private formRecordar : FormBuilder, private usuarioInyectado: UsuarioService) { }

  formularioRecordar = this.formRecordar.group({
    email : ['',[Validators.required, Validators.pattern(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/)]]
  })
  ngOnInit(): void {
    // se le envia correo electronico al usuario para dar acceso a recordar contraseña

  }

  recogerDatos()
  {
    
      this.email.tipo=  8;
      this.email.para = this.formularioRecordar.value['email'];
      this.email.asunto = 'Recordatorio Password';
      this.email.email = this.formularioRecordar.value['email'];
      let emailUsuario : enviarEmail = new enviarEmail();
      emailUsuario.email = this.formularioRecordar.value['email'];
      //comprobamos que el email esta en nuestra base de datos
      this.usuarioInyectado.idUsuario(emailUsuario).subscribe (( datos => {
          if (datos == 201)
          {
              Swal.fire(
                'Error!',
                'No se ha encontrado el email. compruebe los datos',
                'error'
              );
          }
          else{
              this.emailInyectado.email_usuario(this.email).subscribe((datosDevueltos => {
                  if (datosDevueltos.resultado == 200)
                  {
                    Swal.fire(
                      'Correcto!',
                      'Se ha enviado un email con las instrucciones para reestablecer su contraseña.',
                      'success'
                    );
                  }
                  else{
                    Swal.fire(
                      'Error!',
                      'No se ha podido enviar email. Revise su configuración.',
                      'error'
                    );
                  }
              })) 

          }
      }))
  }

}
