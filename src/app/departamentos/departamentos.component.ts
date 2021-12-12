import { Component, OnInit } from '@angular/core';
import { Departamento } from '../modelos/departamento';
import { ConfiguracionService } from '../servicios/configuracion.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  lista_departamentos : Array<Departamento> = new Array<Departamento>();
  formAgregarDepartamento = this.formB.group({
    departamento:['',[Validators.required,Validators.pattern(/[a-zA-Z]{1,25}/)]]
  });


  constructor(private formB: FormBuilder, private configuracionInyectado : ConfiguracionService, private usuarioInyectado : UsuarioService) { }


  ngOnInit(): void {
    this.departamentos();
  }

  departamentos()
  {
    //mostramos los departamentos que tenemos
    this.lista_departamentos = [];
    this.usuarioInyectado.departamentosUsuarios().subscribe((datosDevueltos => {
        this.lista_departamentos = datosDevueltos;
    }));
  }

  agregarDepartamento()
  {
    //agregamos departamento
    const nombre_dep = {
        nombre: this.formAgregarDepartamento.value['departamento']};
    this.configuracionInyectado.addDepartamento(nombre_dep).subscribe((datoDevuelto =>{
      console.log(datoDevuelto);
      
      if (datoDevuelto == 200)
      {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Departamento agregado',
            showConfirmButton: true,
          });
          window.location.reload();
      }
      else if (datoDevuelto == 201)
      {
          Swal.fire({
              title: 'Error!',
              text: 'No se ha podido crear el departamento',
              icon: 'error',
              confirmButtonText: 'OK'
          });      
      }
      else if (datoDevuelto == 202)
      {
          Swal.fire({
              title: 'Error!',
              text: 'Ya existe un Departamento con ese Nombre',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
    }));
    
  }
}
