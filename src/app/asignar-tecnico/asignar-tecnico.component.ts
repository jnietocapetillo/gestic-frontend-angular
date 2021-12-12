import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Email } from '../modelos/email';
import { Incidencia } from '../modelos/incidencia';
import { Usuario } from '../modelos/usuario';
import { EnviosEmailService } from '../servicios/envios-email.service';
import { IncidenciaService } from '../servicios/incidencia.service';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-asignar-tecnico',
  templateUrl: './asignar-tecnico.component.html',
  styleUrls: ['./asignar-tecnico.component.css']
})
export class AsignarTecnicoComponent implements OnInit {

  idIncidencia : number = 0;
  tecnicos : Array<Usuario> = new Array<Usuario>();
  incidencia : Incidencia = new Incidencia();
  usuario : string = '';
  email : Email = new Email();

  constructor(private router: Router, private rutaActiva: ActivatedRoute, private formB : FormBuilder, private incidenciaInyectada : IncidenciaService, private mensajeInyectado: MensajeService, private usuarioInyectado : UsuarioService, private emailInyectado: EnviosEmailService) { }

  formAsignarTecnico = this.formB.group({
    tecnico: [Validators.required],
    prioridad: [Validators.required]
  });

  ngOnInit(): void {
    this.idIncidencia = this.rutaActiva.snapshot.params.id;

    //ponemos el nombre del usuario de la incidencia
    this.incidenciaInyectada.idUsuarioIdIncidencia(this.idIncidencia).subscribe(( dato => {
        if (dato.estado == 200)
        {
          //pregunto el nombre del usuario
          this.usuarioInyectado.detalleUsuario(dato.datos.idusuario).subscribe(( devuelto => {
              this.usuario = devuelto.datos.nombre+' '+devuelto.datos.apellidos;
          }));
        }
    }));
    //nos traemos la incidencia
    this.incidenciaInyectada.detalleIncidencia(this.idIncidencia).subscribe((respuesta =>{
        if (respuesta.mensaje == 200)
        {
          this.incidencia = respuesta.datos;
        }
    }));    
    //sacamos los tecnicos que tenemos
    this.usuarioInyectado.tecnicosDisponibles().subscribe((datosDevueltos => {
      this.tecnicos = datosDevueltos;
    }));

  }

  asignar()
  {
    const datos ={'id':this.idIncidencia, 'tecnico':this.formAsignarTecnico.value['tecnico'], 'prioridad':this.formAsignarTecnico.value['prioridad']};
    //asignamos los valores a tecnico y prioridad
    this.incidenciaInyectada.asignarTecnicoPrioridad(datos).subscribe((respuesta => {
      if (respuesta == 200)
      { 
          this.marcarLeido();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tecnico asignado y Prioridad',
            showConfirmButton: true,
          });
      }
      else
      {
          Swal.fire({
              title: 'Error!',
              text: 'Uy no se ha podido actualizar',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
    }));
    this.router.navigate(['escritorio']);
  }

  marcarLeido()
  {
    this.mensajeInyectado.actualizarLeido(this.idIncidencia).subscribe(( respuesta =>{
        if (respuesta == 200)
        {
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Incidencia actualizada y mensaje leido',
            showConfirmButton: true,
          });
        }
    }));
    //enviamos email asignacion de tecnico al usuario
    this.email.tipo = 7;
    this.email.incidencia = this.idIncidencia;
    //averiguamos email del usuario de la incidencia
    this.usuarioInyectado.detalleUsuario(this.idIncidencia).subscribe((respuesta => {
        this.email.para = respuesta.datos.email;
    
        this.email.tecnico = this.formAsignarTecnico.value['tecnico'];
        this.emailInyectado.email_usuario(this.email).subscribe (( datosDevueltos =>{
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
    }))
  }

}
