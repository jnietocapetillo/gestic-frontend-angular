import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../modelos/usuario';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-detalle-usuario-admin',
  templateUrl: './detalle-usuario-admin.component.html',
  styleUrls: ['./detalle-usuario-admin.component.css']
})
export class DetalleUsuarioAdminComponent implements OnInit {

  clase_activo: string = "p-2 w-75 usuarioNoActivo"; // inicializo la clase de usuario activado a No activado.
  perfil_usuario : string = '';
  departamento_usuario : string = '';
  idUsuario: number = 0;
  detalleUsuario : Usuario = new Usuario();

  constructor(public usuarioInyectado: UsuarioService, private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {
    //cogemos el parametro pasado por la ruta
    this.idUsuario = this.rutaActiva.snapshot.params.id;

    //preguntamos quien es el usuario
    this.usuarioInyectado.detalleUsuario(this.idUsuario).subscribe((datosDevueltos => {
        if ( datosDevueltos.estado == 200)
        {
            this.detalleUsuario = datosDevueltos.datos;
            //al cargar detalle de usuario ponemos la clase de si el usuario es activo o no
              if (this.detalleUsuario.activo == 1)
                this.clase_activo = "p-2 w-75 usuarioActivo";

                    this.usuarioInyectado.perfilUsuario(this.detalleUsuario.idusuario).subscribe((datoDevuelto =>{
                        this.perfil_usuario= datoDevuelto;
                    }));

                    this.usuarioInyectado.departamentoUsuario(this.detalleUsuario.idDepartamento).subscribe((datoDevuelto => {
                        this.departamento_usuario = datoDevuelto;
                    }));

                    this.usuarioInyectado.perfilUsuario(this.detalleUsuario.idPerfil).subscribe((datoDevuelto => {
                        this.perfil_usuario = datoDevuelto;
                    }));
          }
      }))
  }
  

}
