import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';


@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {

  clase_activo: string = "p-2 w-75 usuarioNoActivo"; // inicializo la clase de usuario activado a No activado.
  constructor(public usuarioInyectado: UsuarioService) { }

  perfil_usuario : string = '';
  departamento_usuario : string = '';

  ngOnInit(): void {

    //al cargar detalle de usuario ponemos la clase de si el usuario es activo o no
    if (this.usuarioInyectado.usuario.activo == 1)
      this.clase_activo = "p-2 w-75 usuarioActivo";

    this.usuarioInyectado.perfilUsuario(this.usuarioInyectado.usuario.idusuario).subscribe((datoDevuelto =>{
        this.perfil_usuario= datoDevuelto;
    }));

    this.usuarioInyectado.departamentoUsuario(this.usuarioInyectado.usuario.idDepartamento).subscribe((datoDevuelto => {
        this.departamento_usuario = datoDevuelto;
    }));

    this.usuarioInyectado.perfilUsuario(this.usuarioInyectado.usuario.idPerfil).subscribe((datoDevuelto => {
        this.perfil_usuario = datoDevuelto;
    }));
  
  }

}
