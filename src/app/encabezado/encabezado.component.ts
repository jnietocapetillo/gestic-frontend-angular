import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';


@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {

  titulo: string = './assets/titulo1.png';
  logo: string = './assets/logo_servicio.png';
  imagenUsuario: string = './assets/usuarioH.png';
  login: string = './assets/login.png';


  constructor(public usuarioInyectado : UsuarioService,private router: Router) {

  }
  ngOnInit(): void {
    this.usuarioInyectado.usuario = JSON.parse(sessionStorage.getItem('usuario') || 'Default Value');
  }

  /**
   * funcion que anula la sesion abierta de un usuario
   */
  limpiarUsuario()
  {
    this.usuarioInyectado.usuario.hayUsuario = false;
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['']);
  }

}

