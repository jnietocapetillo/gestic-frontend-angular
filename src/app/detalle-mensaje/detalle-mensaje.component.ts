import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mensaje } from '../modelos/mensaje';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-detalle-mensaje',
  templateUrl: './detalle-mensaje.component.html',
  styleUrls: ['./detalle-mensaje.component.css']
})
export class DetalleMensajeComponent implements OnInit {

  Idmensaje : number = 0;
  mensaje : Mensaje = new Mensaje();
  usuario_origen : string = '';
  usuario_destino : string = '';
  idincidencia : number = 0;

  constructor(private rutaActiva: ActivatedRoute,private mensajeInyectado : MensajeService, private usuarioInyectado : UsuarioService) { }

  ngOnInit(): void {
    this.Idmensaje = this.rutaActiva.snapshot.params.id;
    this.cargarMensaje();
  }

  cargarMensaje()
  {
    //sacamos el detalle del mensaje
    this.mensajeInyectado.detalleMensaje(this.Idmensaje).subscribe((datoDevuelto =>{
      if (datoDevuelto.estado == 200)
      {
          this.mensaje = datoDevuelto.datos;
          this.idincidencia = this.mensaje.idincidencia;
          //averiguamos el nombre del usuario origen
          this.usuarioInyectado.nombreUsuario(this.mensaje.idusuario_origen).subscribe((datoDevuelto => {
              this.usuario_origen=datoDevuelto;
          }));
          this.usuarioInyectado.nombreUsuario(this.mensaje.idusuario_receptor).subscribe((datoDevuelto =>{
              this.usuario_destino=datoDevuelto;
          }));
          
      }
    }));
  }

}
