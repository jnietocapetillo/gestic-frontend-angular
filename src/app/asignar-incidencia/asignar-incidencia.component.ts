import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incidencia } from '../modelos/incidencia';
import { IncidenciaService } from '../servicios/incidencia.service';

@Component({
  selector: 'app-asignar-incidencia',
  templateUrl: './asignar-incidencia.component.html',
  styleUrls: ['./asignar-incidencia.component.css']
})
export class AsignarIncidenciaComponent implements OnInit {

  incidencia : Incidencia = new Incidencia();
  idIncidencia : number = 0;
  //activamos en el constructor las rutas para poder recibir los datos adjuntos
  constructor(private rutaActiva: ActivatedRoute, public incidenciaInyectada: IncidenciaService) { }

  ngOnInit(): void {

    //cogemos el dato pasado por parametro desde mensajes pendientes
    this.idIncidencia = this.rutaActiva.snapshot.params.id;
    this.incidenciaSeleccionada();
  }

  /**
   * funcion que rescata la incidencia para poder realizar cambios. La trae de la Api y la pone en servicio incidencia
   */
  incidenciaSeleccionada()
  {
      this.incidenciaInyectada.detalleIncidencia(this.idIncidencia).subscribe((datosDevueltos =>{
        if (datosDevueltos.mensaje == 200)
        this.incidencia = datosDevueltos.datos;
      }));
      
      
  }

}
