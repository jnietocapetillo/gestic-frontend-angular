
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../modelos/usuario';
import { ConfiguracionService } from '../servicios/configuracion.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  tipo_configuracion :number = 0;
  
  
  lista_usuarios : Array<Usuario> = new Array<Usuario>();

  constructor(private rutaActiva: ActivatedRoute, private formBuilder: FormBuilder, private configuracionInyectado : ConfiguracionService, private usuarioInyectado : UsuarioService) { }


  ngOnInit(): void {
  }

  

  

  usuarios()
  {

  }
}
