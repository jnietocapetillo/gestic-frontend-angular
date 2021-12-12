import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Email } from '../modelos/email';
import { Usuario } from '../modelos/usuario';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { UsuarioService } from '../servicios/usuario.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  formularioEmail = this.formB.group({
    de : [''],
    para : [''],
    correos : [''],
    asunto : [''],
    mensaje : ['']
  });

  usuarios : Array<Usuario> = new Array<Usuario>();

  public Editor = ClassicEditor;
  public editorData :string = '<p>es una prueba</p>';

  constructor(private emailInyectado : EnviosEmailService, private formB : FormBuilder, private usuarioInyectado: UsuarioService) { }

  email : Email = new Email();

  ngOnInit(): void {
      //ponemos los datos iniciales en el formulario
      this.formularioEmail.controls['de'].setValue(this.usuarioInyectado.usuario.nombre+' '+this.usuarioInyectado.usuario.apellidos);
      this.usuarioInyectado.listaUsuarios().subscribe((datosDevueltos => {
          this.usuarios = datosDevueltos;
      }));
  }

  /**
   * funcion que va agregando destinatarios del email
   */
  agregarDestinatario()
  {
      let agregar;
      
      let correos_anteriores = this.formularioEmail.value['correos'];
      let correos = this.formularioEmail.value['para'];
      if (correos_anteriores =="")
      {
          agregar = correos_anteriores+correos;
      }
      else
      {
          agregar = correos_anteriores+';'+correos;
      }
        

      this.formularioEmail.controls['correos'].setValue(agregar);
  }

  /**
   * funcion que envia el email para los destinatarios correspondientes
   */
  enviar()
  {
      this.email.tipo = 5; 
      this.email.para= this.formularioEmail.value['para'];
      this.email.asunto = this.formularioEmail.value['asunto'];
      this.email.usuario = this.usuarioInyectado.usuario.nombre+' '+this.usuarioInyectado.usuario.apellidos;
      this.email.mensaje = this.formularioEmail.value['mensaje'];
      
    this.emailInyectado.email_usuario(this.email).subscribe((datosDevueltos => {
        console.log(datosDevueltos);
        
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
                text: 'No se ha podido enviar el correo',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }));
  }
}
