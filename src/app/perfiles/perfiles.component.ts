import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Perfil } from '../modelos/perfil';
import { ConfiguracionService } from '../servicios/configuracion.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  lista_perfiles : Array<Perfil> = new Array<Perfil>();
  formAgregarPerfil = this.formBuilder.group({
    perfil:['',[Validators.required,Validators.pattern(/[a-zA-Z]{1,30}/)]]
  });

  constructor(private formBuilder: FormBuilder, private configuracionInyectado : ConfiguracionService, private usuarioInyectado : UsuarioService) { }

  ngOnInit(): void {
    this.perfiles();
  }

  perfiles()
  {
      //mostramos los perfiles
      this.lista_perfiles=[];
      this.usuarioInyectado.perfilesUsuarios().subscribe((datosDevueltos =>{
        this.lista_perfiles = datosDevueltos;
      }));
  }

  agregarPerfil()
  {
      //agregamos perfil
    const nombre_perfil = {
        nombre: this.formAgregarPerfil.value['perfil']};
    this.configuracionInyectado.addPerfil(nombre_perfil).subscribe((datoDevuelto =>{
      if (datoDevuelto == 200)
      {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Perfil agregado',
            showConfirmButton: true,
          });
        window.location.reload();
      }
      else if (datoDevuelto == 201)
      {
          Swal.fire({
              title: 'Error!',
              text: 'No se ha podido crear el perfil',
              icon: 'error',
              confirmButtonText: 'OK'
          });      
      }
      else if (datoDevuelto == 202)
      {
          Swal.fire({
              title: 'Error!',
              text: 'Ya existe un Perfil con ese Nombre',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
    }));
  }
}
