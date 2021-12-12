import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import Swal from 'sweetalert2';
import { actualizarPassword } from '../modelos/resetPassword';
import { enviarEmail } from '../modelos/envioEmail';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ngx-captcha';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  //declaramos un formgroup para coger los datos y validarlos antes de actualizar la contraseña
  datosActualizar : actualizarPassword = new actualizarPassword;
  enviarEmail : enviarEmail = new enviarEmail;

  formResetPassword = this.formBuilder.group({
    email: ['',[Validators.required, Validators.pattern(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/)]],
    password: ['',[Validators.required, Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]],
    passwordR: ['',[Validators.required, Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]]
  });

  siteKey: string = "6LfMs3gdAAAAACqv3eWXI2s0n2ser-9m-R5xfArH";
 
  constructor(private reCaptchaV3Service: ReCaptchaV3Service,private usuarioInyectado : UsuarioService, private formBuilder: FormBuilder, private route: Router) { }

  ngOnInit(): void {
      //hacemos logout por si viene de usuario logueado
      this.usuarioInyectado.usuario.hayUsuario = false;
      sessionStorage.clear();
      localStorage.clear();
  }

  /**
   * recoge los datos del formulario ya validado
   */
  recogerDatos()
  {
    //comprobamos que las contraseñas coincidan
    if (this.formResetPassword.value['password'] === this.formResetPassword.value['passwordR'] )
    {
      this.enviarEmail.email = this.formResetPassword.value['email'];
      //coinciden las contraseñas y podemos actualizar los datos
      //averiguamos que id tiene el usuario con ese email
      this.usuarioInyectado.idUsuario(this.enviarEmail).subscribe((datoDevuelto =>{
          
          if (datoDevuelto == -1)
          {
            Swal.fire({
                  title: 'Error!',
                  text: 'La cuenta no existe',
                  icon: 'error',
                  confirmButtonText: 'OK'
              })
          }  
          else
          {
              
              this.datosActualizar.id = datoDevuelto;
              this.datosActualizar.password = this.formResetPassword.value['password'];
              
              this.usuarioInyectado.updatePassword(this.datosActualizar).subscribe((datoDevuelto =>{
              //mensaje alert
              
              if (datoDevuelto.estado == 200)
              {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se ha actualizado la Contraseña',
                    showConfirmButton: true,
                  });
                  this.route.navigate(['']);
              }
              else
              {
                  Swal.fire({
                      title: 'Error!',
                      text: 'No se ha podido actualizar la Contraseña',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  })
              }
              }));
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

}
