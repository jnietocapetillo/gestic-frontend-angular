import { Component, OnInit } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { UsuarioService } from '../servicios/usuario.service';


@Component({
  selector: 'app-pie-de-pagina',
  templateUrl: './pie-de-pagina.component.html',
  styleUrls: ['./pie-de-pagina.component.css']
})
export class PieDePaginaComponent implements OnInit {


  constructor(public usuarioInyectado: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioInyectado.usuario = JSON.parse(sessionStorage.getItem('usuario') || 'Default Value');
  }


}
